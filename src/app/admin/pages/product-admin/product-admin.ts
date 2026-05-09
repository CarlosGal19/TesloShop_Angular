import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductDetails } from './product-details/product-details';

@Component({
  selector: 'product-admin',
  imports: [ProductDetails],
  templateUrl: './product-admin.html',
})
export class ProductAdmin {
  productsService = inject(ProductsService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  id = this.activatedRoute.snapshot.paramMap.get('productId') ?? '';

  term = signal(this.id);

  productResource = rxResource({
    params: () => ({
      term: this.term()
    }),
    stream: ({ params }) => {
      return this.productsService.getProductByTerm(params.term);
    }
  });

  redirectEffect = effect(() => {
    if (this.productResource.error()) {
      this.router.navigate(['/admin/products']);
    }
  });
}
