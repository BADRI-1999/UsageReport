import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-popups',
  standalone: true,
  imports: [],
  templateUrl: './popups.component.html',
  styleUrl: './popups.component.css'
})
export class PopupsComponent {

  usagedetails : any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PopupsComponent>,
    private apiService: ApiService,
    private http: HttpClient,
  ) {
    this.usagedetails= data.usageDetails
  }




  closeDialog(): void {
    this.dialogRef.close();
  }

 sendEmail(){
  const to = 'saiprasadgovindu@gmail.com';
    const subject = 'Test Email';
    const text = 'Please find the CSV attachment';
    const data = this.usagedetails;


    this.apiService.sendEmail(to,subject,text,data).subscribe({
      next: (res) =>{
        console.log("email sent", res)
      },
      error: (error)=>{
        console.log("sending email failed", error)
      }
    });
  
 }

 downloadcsv(){
  console.log("before calling api/http", this.usagedetails)
  this.apiService.downloadCSV(this.usagedetails).subscribe({
    next: (res) =>{
      const blob = new Blob([res], { type: 'text/csv' }); // Set MIME type
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.csv'; // Set the desired filename
        document.body.appendChild(a);
        a.click(); // Trigger the download
        document.body.removeChild(a); // Clean up
        window.URL.revokeObjectURL(url); // Release the object URL
        console.log("Downloaded CSV", res);
    },
    error: (error)=>{
      console.log("downloading failed", error)
    }
  });

 }
 downloadpdf() {
  this.apiService.downloadPDF(this.usagedetails).subscribe({
    next: (res) => {
      const blob = new Blob([res], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // Create a link element
      const a = document.createElement('a');
      a.href = url;
      a.download = 'downloaded-file.pdf'; // Set the filename
      document.body.appendChild(a);
      a.click(); // Trigger the download
      document.body.removeChild(a); // Clean up
      window.URL.revokeObjectURL(url); // Release the blob URL
      console.log("Downloaded PDF", res);
    },
    error: (error) => {
      console.log("downloading failed", error);
    }
  });
}
 





}
