import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { IProduct } from '@products/interfaces/product-response.interface';
import { ProductImagePipe } from '@products/pipes/product-image-pipe';

@Component({
  selector: 'products-table',
  imports: [RouterLink, CurrencyPipe, ProductImagePipe],
  templateUrl: './products-table.html',
})
export class ProductsTable {
  products = input.required<IProduct[]>();
}
