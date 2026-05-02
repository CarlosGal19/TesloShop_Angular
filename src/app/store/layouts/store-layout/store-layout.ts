import { Component } from '@angular/core';
import { HeaderNavbar } from '../../components/header-navbar/header-navbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'layout-store-layout',
  imports: [
    HeaderNavbar,
    RouterOutlet
],
  templateUrl: './store-layout.html',
})
export class StoreLayout {

}
