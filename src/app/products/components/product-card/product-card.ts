import { SlicePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ProductImagePipe } from '@products/pipes/product-image-pipe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  templateUrl: './product-card.html',
})
export class ProductCard {
  productId = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
  imageUrl = input.required<string>();
}
