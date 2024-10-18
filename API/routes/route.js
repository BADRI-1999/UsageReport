import express from "express";
import checkJwt from "../middleware/auth.js";
import multer from "multer";
import sgMail from "@sendgrid/mail";
import fs from "fs";
import { config } from "dotenv";
import { json2csv } from "json-2-csv";

import PDFDocument from "pdfkit";

import puppeteer from "puppeteer";
import handlebars from "handlebars";

config()


async function createCsv(data) {
  let csv = await json2csv(data);
  return csv;

}

const router = express.Router();
const upload = multer({ dest: "uploads/" });
// console.log(process.env.SENDGRID_API_KEY)

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Define protected route
router.get("/api/protected", checkJwt, (req, res) => {
  console.log("Protected route accessed");
  res.status(200).json({
    message: "welcome",
  });
});

// Route to send email with CSV attachment
router.post("/api/send-email", async (req, res) => {
  try {
  
    let { to, subject, text, data } = req.body;
    data = data.value.map(item => item.properties);
    let csv = await createCsv(data)
    const filePath = "uploads/data.csv";
    fs.writeFileSync(filePath, csv);

    

    // Read the CSV file
    const csvData = fs.readFileSync(filePath);

    // Create SendGrid message
    const msg = {
      to: to,
      from: "badri.siva1999@gmail.com", // Replace with your verified sender email
      subject: subject,
      text: text,
      attachments: [
        {
          content: csvData.toString("base64"),
          filename: 'data.csv',
          type: 'text/csv',
          disposition: "attachment",
        },
      ],
    };

    // Send the email
    await sgMail.send(msg);

    // Remove the uploaded file after sending the email
    fs.unlinkSync(filePath);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.log(error)
    console.error("Error sending email: ", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

router.post("/api/download-csv", async (req, res) => {
  try {
    
    const jsonData = req.body;

    if (!jsonData || !jsonData.value) {
      return res.status(400).json({ message: "Invalid JSON data" });
    }
    console.log(jsonData)
    const data = jsonData.value.map(item => item.properties);
    const csv = await json2csv(data);

    const filePath = "uploads/data.csv";
    fs.writeFileSync(filePath, csv);

    res.download(filePath, "data.csv", (err) => {
      if (err) {
        console.error("Error downloading file: ", err);
        return res.status(500).json({ message: "Failed to download file" });
      }

      // Remove the file after download
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error("Error converting JSON to CSV: ", error);
    res.status(500).json({ message: "Failed to convert JSON to CSV" });
  }
});
router.post("/api/download-pdf", async (req, res) => {
  try {
    
    const jsonData = req.body;

    if (!jsonData || !jsonData.value) {
      return res.status(400).json({ message: "Invalid JSON data" });
    }

    const data = jsonData.value.map(item => item.properties);

    // Create HTML template for the table using Handlebars
    const templateHtml = `
      <html>
        <head>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table, th, td {
              border: 1px solid black;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <h1>Usage Data</h1>
          <table>
            <thead>
              <tr>
                {{#each headers}}
                  <th>{{this}}</th>
                {{/each}}
              </tr>
            </thead>
            <tbody>
              {{#each data}}
                <tr>
                  {{#each this}}
                    <td>{{this}}</td>
                  {{/each}}
                </tr>
              {{/each}}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const template = handlebars.compile(templateHtml);
    const headers = Object.keys(data[0]);
    const html = template({ headers, data });

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    const pdfPath = "uploads/data.pdf";
    await page.pdf({ path: pdfPath, format: 'A4' });
    await browser.close();

    res.download(pdfPath, "data.pdf", (err) => {
      if (err) {
        console.error("Error downloading file: ", err);
        return res.status(500).json({ message: "Failed to download file" });
      }

      // Remove the file after download
      fs.unlinkSync(pdfPath);
    });
  } catch (error) {
    console.error("Error converting JSON to PDF: ", error);
    res.status(500).json({ message: "Failed to convert JSON to PDF" });
  }
});

export default router;
