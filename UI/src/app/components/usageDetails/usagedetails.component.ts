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
  display: boolean = false;
  showModal: boolean = false;
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

  ngOnInit(): void {
    console.log("Getting usage report");
    this.callApi()
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
    else{
    // const staticDate = new Date('2024-03-12T22:00:00');
    this.endDate  = new Date(Date.now());
    this.startDate = new Date(this.endDate.getTime() - this.selectedHours * 60 * 60 * 1000);
    console.log("end time = ", this.startDate);
    console.log("start time = ", this.startDate);
    }
  


    

    try {
      this.usageDetails = await firstValueFrom(
        this.subscriptionService.getUsageDetails('52435666-b2cb-431f-8490-6f1524da777e', this.startDate.toISOString(), this.endDate.toISOString())
      );
      
      console.log('Received usage details in DashboardComponent:', this.usageDetails);
      
      
      
      this.renderTemplate();
      
    } catch (error) {
      console.error("Error fetching usage details: ", error);
    } finally {
      this.isLoading = false; 
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





  

}
