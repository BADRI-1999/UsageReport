// src/app/services/api.service.ts

import { HttpHeaders,HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  usagedata: any;

  constructor(private http: HttpClient) { }

  downloadTable(usageDetails: any) {
    // Check if usageDetails is available
    if (!usageDetails || !usageDetails.value) {
      console.error('No data available for download.');
      return;
    }
  
    // Create CSV content
    const csvContent = this.generateCSV(usageDetails.value);
  
    // Create a blob and a link to trigger the download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'usage_details.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  generateCSV(data: any[]) {
    // Define CSV headers
    const headers = [
      'Date',
      'Product',
      'Billing Period',
      'Quantity',
      'Effective Price',
      'Cost',
      'Unit Price',
      'Publisher',
      'Resource Location',
      'Offer ID',
    ];
  
    // Create CSV rows
    const rows = data.map(item => [
      item.properties.date,
      item.properties.product,
      `${item.properties.billingPeriodStartDate} - ${item.properties.billingPeriodEndDate}`,
      item.properties.quantity,
      item.properties.effectivePrice,
      `${item.properties.cost} ${item.properties.billingCurrency}`,
      item.properties.unitPrice,
      item.properties.publisherType,
      item.properties.resourceLocation,
      item.properties.offerId,
    ]);
  
    // Combine headers and rows into CSV format
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csv;
  }



  sendEmail(to: string, subject: string, text: string, data: any): Observable<any> {
    const body = {
      to,
      subject,
      text,
      data
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>('http://localhost:3000/api/send-email', body, { headers });
  }


  downloadPDF(data:any){

    return this.http.post<any>('http://localhost:3000/api/download-pdf', data, { responseType: 'blob' as 'json'});
  }


  downloadCSV(data:any){
    this.usagedata = data

return this.http.post<any>('http://localhost:3000/api/download-csv', this.usagedata, { responseType: 'blob' as 'json'});

  }


  // dowloadExcel(data:any){
  //   return this.http.post<any>('http://localhost:3000/aapi/download-csv', data);
  // }
}
