import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  sidebarOpen = false;
  isUsageActive: boolean = false;
  isConfigActive: boolean = false;

  toggleButton(button: string) {
    if (button === 'usage') {
      this.isUsageActive = true;
      this.isConfigActive = false;
      this.router.navigate(['/usagedetails'])
    } else if (button === 'config') {
      this.isConfigActive = true;
      this.isUsageActive = false;
      this.router.navigate(['/configuartion'])
    }
  }

  constructor(private authService: AuthService, private router: Router) {}

  // Toggle sidebar visibility
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // Logout logic
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Navigate to login page after logout
  }

  gotoazure(){
    this.router.navigate(['/usagedetails'])
  }

  gotoconfiguration(){
    this.router.navigate(['/configuartion'])
  }
}
