import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent {

  openAddSubscription() {
    console.log('Navigating to Add Subscription');
    // Navigation or logic for opening subscription page/modal
  }

  // Method for user management (add/remove users)
  openUserManagement() {
    console.log('Navigating to User Management');
    // Navigation or logic for managing users
  }

  // Method for setting user permissions
  openPermissions() {
    console.log('Navigating to Permissions Management');
    // Navigation or logic for managing permissions
  }

}
