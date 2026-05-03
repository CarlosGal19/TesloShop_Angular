import { ProductsService } from '@products/services/products.service';
import { Component, inject } from '@angular/core';
import { ProductCard } from '@products/components/product-card/product-card';
import { rxResource } from '@angular/core/rxjs-interop'

@Component({
  selector: 'home-page',
  imports: [
    ProductCard
  ],
  templateUrl: './home-page.html',
})
export class HomePage {
  private productsService = inject(ProductsService);

  productsResource = rxResource({
    params: () => ({}),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        limit: 12
      });
    },
  });
}
