import { Component } from '@angular/core';
import * as Handlebars from 'handlebars';
import { SubscriptionService } from "../../services/subscription.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  usageDetails: any;  // Store the usage details
  display: boolean = false;

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    console.log("Getting usage report");
    this.subscriptionService.getUsageDetails('52435666-b2cb-431f-8490-6f1524da777e', '2024-08-01', '2024-09-30')
    // Subscribe to the usageDetails$ observable to get the data
    
  }

  // Define the Handlebars template directly in TypeScript
  renderTemplate() {
    console.log("inside render template")
    this.display = true;

    // Handlebars template defined directly in TypeScript
    const templateScript = `
      <table>
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

  async callApi() {
    
    this.subscriptionService.usageDetails$.subscribe(data => {
      this.usageDetails = data;
      console.log('Received usage details in DashboardComponent:', this.usageDetails);
      this.renderTemplate();
    });
    
  }
}



// import { Component } from '@angular/core';
// import { SubscriptionService } from "../../services/subscription.service";
// import * as Handlebars from "handlebars";

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.css'
// })
// export class DashboardComponent {

 
//   usageDetails: any;  // Store the usage details
//   display: boolean = false;

//   constructor(private subscriptionService: SubscriptionService) {}

//   ngOnInit(): void {
//     // Subscribe to the usageDetails$ observable to get the data
//     this.subscriptionService.usageDetails$.subscribe(data => {
//       this.usageDetails = data;
//       console.log('Received usage details in DashboardComponent:', this.usageDetails);
//     });
//   }


//   renderTemplate() {
//     this.display = true
//     // Get the template from the HTML
//     const templateScript = document.getElementById('report-template')!.innerHTML;
//     const template = Handlebars.compile(templateScript);

//     // Pass data to Handlebars and generate the HTML
//     const html = template({ value: this.usageDetails });

//     // Insert the generated HTML into the display div
//     document.getElementById('display')!.innerHTML = html;
//   }

//   async callApi() {
//     console.log("getting usage report");
//     this.subscriptionService.getUsageDetails('52435666-b2cb-431f-8490-6f1524da777e', '2024-08-01','2024-09-30')

//     this.renderTemplate();
    

//   }


// }
