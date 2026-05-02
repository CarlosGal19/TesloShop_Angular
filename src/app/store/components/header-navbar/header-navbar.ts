import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'header-navbar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header-navbar.html',
})
export class HeaderNavbar {

}
