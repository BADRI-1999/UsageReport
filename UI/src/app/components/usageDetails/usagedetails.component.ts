import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as Handlebars from 'handlebars';
import { SubscriptionService } from "../../services/subscription.service";
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog'; 
import {  PopupsComponent} from '../popups/popups.component'


@Component({
  selector: 'app-dashboard',
  templateUrl: './usagedetails.component.html',
  styleUrls: ['./usagedetails.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UsageDetailsComponent implements OnInit {
  usageDetails: any; // Store the usage details
  summaryData: { serviceName: string, publisher: string, totalCost: number }[] = [];
  display: boolean = false;
  showModal: boolean = false;
  showHour: boolean = false;
  share: boolean = false;
  selectedHours: number = 1;
  range: FormGroup; // Define FormGroup for date range
  isDateRangeSelected: boolean = false; // New property for toggle state
  startDate: Date | null = null;
  endDate: Date | null = null;
  isLoading: boolean = false;


  constructor(
    public dialog: MatDialog,
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.range = this.fb.group({
      start: [null, Validators.required], // Start date
      end: [null, Validators.required]      // End date
    });

  }



  async ngOnInit() {
    console.log("Getting usage report");
    await this.callApi()
  }

  openShareDialog(): void {
    const dialogRef = this.dialog.open(PopupsComponent, {
      width: '500px',
      data: { usageDetails: this.usageDetails } // Pass the usage details here

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Share dialog was closed');
    });
  }

  renderTemplate() {
    console.log("inside render template");
    this.display = true;
    this.showHour = false;


  if (!this.usageDetails || !this.usageDetails.value) {
    console.error('Usage details are not available for rendering.');
    return; // Exit if usage details are not available
  }
    // Handlebars template defined directly in TypeScript
    const templateScript = `
    <table class="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Product</th>
          <th>Billing Period</th>
          <th>Quantity</th>
          <th>Effective Price</th>
          <th>Cost</th>
          <th>Unit Price</th>
          <th>Publisher</th>
          <th>Resource Location</th>
          <th>Offer ID</th>
        </tr>
      </thead>
      <tbody>
        {{#each value}}
          <tr>
            <td>{{properties.date}}</td>
            <td>{{properties.product}}</td>
            <td>{{properties.billingPeriodStartDate}} <hr> {{properties.billingPeriodEndDate}}</td>
            <td>{{properties.quantity}}</td>
            <td>{{properties.effectivePrice}}</td>
            <td>{{properties.cost}} {{properties.billingCurrency}}</td>
            <td>{{properties.unitPrice}}</td>
            <td>{{properties.publisherType}}</td>
            <td>{{properties.resourceLocation}}</td>
            <td>{{properties.offerId}}</td>
          </tr>
        {{/each}}
      </tbody>
    </table>
  `;
    const template = Handlebars.compile(templateScript);

    // Pass data to Handlebars and generate the HTML
    const html = template({ value: this.usageDetails.value });

    // Insert the generated HTML into the display div
    document.getElementById('display')!.innerHTML = html;
  }


  openModal() {
    this.showModal = true; // Open the modal
  }

  openShare(){
    this.share = true;
  }

  closeModal() {
    
    this.showModal = false; // Close the modal
    
    // this.resetForm(); // Reset form when closing the modal
  }

  closeShare(){
    this.share = false;
  }

  resetForm() {
    this.range.reset(); // Reset the form fields
    // this.isDateRangeSelected = false; // Reset toggle state

  }

  onToggleChange(event: any) {
    this.isDateRangeSelected = event.checked; // Update the state based on toggle
    console.log("date checker:", this.isDateRangeSelected)
  }

  selectOption(hours: number) {
    this.selectedHours = hours; // Set the selected hours

    this.callApi();
    

  }


  async callApi() {
    this.isLoading = true;

    this.closeModal();

    if(this.isDateRangeSelected){
      this.display = true;
    this.showHour = false;
      console.log("inside date range", this.isDateRangeSelected)
      this.startDate = this.range.value.start;
      this.endDate = this.range.value.end;
      console.log(this.range.value.start)
      console.log(this.range.value.end)
      
  
      if (!this.startDate || !this.endDate) {
        console.error("Start and end dates are required.");
        return; // Exit if dates are not valid
      }

  
    }
    else  {
    // const staticDate = new Date('2024-03-12T22:00:00');

    this.endDate  = new Date(Date.now());
    this.startDate = new Date(this.endDate.getTime() - this.selectedHours * 60 * 60 * 1000);
    console.log("end time = ", this.endDate.toISOString());
    console.log("start time = ", this.startDate.toISOString());
    
    }
    

    try {
      if(this.isDateRangeSelected){
              this.usageDetails = await firstValueFrom(
        this.subscriptionService.getUsageDetails('52435666-b2cb-431f-8490-6f1524da777e', this.startDate.toISOString(), this.endDate.toISOString())
      );
      this.renderTemplate();
      }
      else if(this.selectedHours){
        this.display = false;
    this.showHour = true;
        this.showModal = false
        this.subscriptionService.getusagereportbyHour(this.startDate.toISOString(),this.endDate.toISOString()).subscribe({
          next: (usageDetails: any[]) => {
            this.usageDetails = usageDetails; // Store data in a component property
            console.log('Received usage details:', this.usageDetails);
            this.summaryData = []
            this.perHourRender(this.usageDetails)
            this.showHour = true
            
            
           
          },
          error: (error) => {
            console.error("Error fetching usage details: ", error);
          },
          complete: () => {
            this.isLoading = false;
          }
        });

      }

      
      
      console.log('Received usage details in DashboardComponent:', this.usageDetails);
      
      
     
      
      
      
    } catch (error) {
      console.error("Error fetching usage details: ", error);
    } finally {
      this.isLoading = false; 
    }

  }

  perHourRender(usage: any) {
    for (let i = 0; i < usage.length; i++) {
      // Access the name or any other relevant properties of each item
      const item = usage[i];
      let itemName;
      // Check if the item has a `name` property
      if (item.name) {
        console.log("Name:", item.name);
        itemName = item.name
      } else if (item.value && item.value[0]?.name) {
        // If the name is nested within `value`
        console.log("Name:--", item.value[0].name.value);
        itemName = item.value[0].name.value
      } else {
        console.log("No name property found for item at index:", i);
      }

      switch (itemName) {
        case "Transactions": //storageAccount
         this.calculateTransactions(item);
          break;
        case "StorageUsed":
          this.calculateContainerRegistry(item);
          break;

        case "ASP-chatbot-ba4b":
          this.calculateAppServicePlan(item);
          break;
        default:
          console.log("No handler found for item:", itemName);
      }
    }
  }

  async logout() {
    try {
      this.authService.logout(); // Ensure you await the logout 
      console.log("Logged out successfully.");
    } catch (error) {
      console.error("Logout error: ", error);
    }
  }


  getdownload (){
    this.apiService.downloadTable(this.usageDetails);
  }

  calculateTransactions(item: any) {
    console.log("Calculating Transactions");
    const transactionCosts = {
        write: 1.2611,    // Cost per 10,000 write operations
        list: 1.2611,     // Cost per 10,000 list operations
        read: 0.1261,     // Cost per 10,000 read operations
        other: 0.1261     // Cost per 10,000 for all other operations except delete
    };

    let writeCount = 0;
    let readCount = 0;
    let otherCount = 0;

    // Calculate counts based on operation type
    item.value.forEach((metric: any) => {
        metric.timeseries.forEach((series: any) => {
            const operationType = series.metadatavalues[0].value.toLowerCase();

            // Sum all counts in the data array
            const totalSeriesCount = series.data.reduce((sum: number, dataPoint: any) => sum + dataPoint.count, 0);

            console.log(`Operation Type Detected: ${operationType}, Total Count: ${totalSeriesCount}`);

            if (["write", "create", "close", "queryinfo"].includes(operationType)) {
                writeCount += totalSeriesCount;
            } else if (operationType === "read") {
                readCount += totalSeriesCount;
            } else {
                otherCount += totalSeriesCount; // Aggregate all other operations
            }
        });
    });

    // Calculate costs for each transaction type
    const writeCost = (writeCount / 10000) * transactionCosts.write;
    const readCost = (readCount / 10000) * transactionCosts.read;
    const otherCost = (otherCount / 10000) * transactionCosts.other;

    // Format and display the results
    console.log(`Transaction Counts & Calculations`);

    console.log(`Write Transactions`);
    console.log(`Count: ${writeCount}`);
    console.log(`Cost: ( ${writeCount} / 10,000 ) × ${transactionCosts.write} = ≈ ₹${writeCost.toFixed(4)}`);

    console.log(`\nList Transactions`);
    console.log(`Count: 0`);
    console.log(`Cost: ₹0 (if no transactions exist)`);

    console.log(`\nRead Transactions`);
    console.log(`Count: ${readCount}`);
    console.log(`Cost: ( ${readCount} / 10,000 ) × ${transactionCosts.read} = ≈ ₹${readCost.toFixed(4)}`);

    console.log(`\nAll Other Operations (including non-listed types)`);
    console.log(`Combined Count: ${otherCount}`);
    console.log(`Cost: ( ${otherCount} / 10,000 ) × ${transactionCosts.other} = ≈ ₹${otherCost.toFixed(2)}`);

    // Total cost calculation
    const totalCost = writeCost + readCost + otherCost;
    console.log(`\nTotal Estimated Cost: ≈ ₹${totalCost.toFixed(2)}`);

    this.summaryData.push({
      serviceName: item.namespace,
      publisher: "Azure Storage",
      totalCost: parseFloat(totalCost.toFixed(2))
  });
}

calculateContainerRegistry(item: any) {
  console.log("Calculating Container Registry Storage");

  // Basic plan parameters
  const baseCostPerDay = 13.86; // Base cost for Basic plan per day
  const includedStorageGB = 10;   // 10 GB included storage for Basic plan
  const additionalCostPerGBPerDay = 0.28026; // Additional cost per GB per day beyond included storage

  let totalBytes = 0;

  // Sum up all the average values
  item.value.forEach((metric: any) => {
      metric.timeseries.forEach((series: any) => {
          series.data.forEach((dataPoint: any) => {
              totalBytes += dataPoint.average;
          });
      });
  });

  // Convert bytes to gigabytes
  const totalGB = totalBytes / (1024 ** 3);

  // Calculate additional storage used beyond the included 10 GB
  const additionalGB = totalGB > includedStorageGB ? totalGB - includedStorageGB : 0;
  const additionalCost = additionalGB * additionalCostPerGBPerDay;

  // Total cost calculation
  const totalCost = (baseCostPerDay + additionalCost);

  // Display the result
  console.log(`Total Storage Used: ${totalGB.toFixed(2)} GB`);
  console.log(`Included Storage: ${includedStorageGB} GB`);
  console.log(`Additional Storage Used: ${additionalGB.toFixed(2)} GB`);
  console.log(`Additional Cost for Extra Storage: ₹${additionalCost.toFixed(2)}`);
  console.log(`\nTotal Estimated Daily Cost: ₹${totalCost.toFixed(2)}`);
  this.summaryData.push({
    serviceName: item.namespace,
    publisher: "Azure Container Registry",
    totalCost: parseFloat((totalCost / 24).toFixed(2))

});
}



calculateAppServicePlan(item: any) {
  console.log("Calculating App Service Plan Cost");

  // Basic plan hourly rates
  const hourlyRates:any = {
    B1: 1.598,
    B2: 3.111,
    B3: 6.222
};

  const sku = item.sku;
  const size = sku.size;         // Plan size (B1, B2, or B3)
  const capacity = sku.capacity; // Number of instances

  // Retrieve the hourly rate based on the size
  const hourlyRate = hourlyRates[size];

  if (!hourlyRate) {
      console.log(`Unknown plan size: ${size}`);
      return;
  }

  // Calculate total cost
  const costPerHour = hourlyRate * capacity;
  const costPerDay = costPerHour * 24;
  const costPerMonth = costPerDay * 30;

  // Display the results
  console.log(`App Service Plan: ${size}`);
  console.log(`Number of Instances: ${capacity}`);
  console.log(`Hourly Rate for ${size}: ₹${hourlyRate}`);
  console.log(`Cost Per Hour: ₹${costPerHour.toFixed(2)}`);
  console.log(`Cost Per Day: ₹${costPerDay.toFixed(2)}`);
  console.log(`Cost Per Month: ₹${costPerMonth.toFixed(2)}`);

  this.summaryData.push({
    serviceName: item.name,
    publisher: "Azure App Service",
    totalCost: parseFloat(costPerHour.toFixed(2))
});

}




  

}
