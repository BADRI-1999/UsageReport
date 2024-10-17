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
    this.router.navigate(['/dashboard'])
  }
}
