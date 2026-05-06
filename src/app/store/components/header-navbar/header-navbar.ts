import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth-service';

@Component({
  selector: 'header-navbar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header-navbar.html',
})
export class HeaderNavbar {
  authService = inject(AuthService);
}
