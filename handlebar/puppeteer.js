const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:5500/template.html', { waitUntil: 'networkidle0' });


    const headings = await page.$$eval('table thead th', (heads) => {
        return heads.map(head => head.innerText);
    });


    const rows = await page.$$eval('table tbody tr', (rows) => {
        return rows.map(row => {
            const cells = row.querySelectorAll('td');
            return Array.from(cells).map(cell => cell.innerText);
        });
    });

  
    const rowsPerPage = 30; 
    const pdfContent = [];


    for (let i = 0; i < rows.length; i += rowsPerPage) {
        const chunk = rows.slice(i, i + rowsPerPage);
        
 
        pdfContent.push(`
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>${headings.map(heading => `<th style="border: 1px solid black; padding: 8px;">${heading}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${chunk.map(row => `
                        <tr>${row.map(cell => `<td style="border: 1px solid black; padding: 8px;">${cell}</td>`).join('')}</tr>
                    `).join('')}
                </tbody>
            </table>
            <div style="page-break-after: always;"></div> <!-- Force page break -->
        `);
    }

   
    const pdfPage = await browser.newPage();
    await pdfPage.setContent(pdfContent.join('')); 


    await pdfPage.pdf({
        path: 'report.pdf',
        format: 'A4',
    });

    await browser.close();
})();
