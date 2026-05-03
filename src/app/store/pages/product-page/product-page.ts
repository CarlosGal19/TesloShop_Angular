import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';

@Component({
  selector: 'product-page',
  imports: [],
  templateUrl: './product-page.html',
})
export class ProductPage {
  productsService = inject(ProductsService);
  activatedRoute = inject(ActivatedRoute);

  queryParam = this.activatedRoute.snapshot.paramMap.get('id') ?? ''

  term = signal(this.queryParam);

  productResource = rxResource({
    params: () => ({
      term: this.term()
    }),
    stream: ({ params }) => {
      return this.productsService.getProductByTerm(params.term)
    }
  })
}
