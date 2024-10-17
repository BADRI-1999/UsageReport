// src/app/services/api.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

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
}
