import { Component, computed, input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
})
export class ProductCard {
  productId = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
  imageUrl = input.required<string>();

  baseUrl = computed(() =>
    `${environment.baseUrl}/files/product/${this.imageUrl()}`
  );
}
