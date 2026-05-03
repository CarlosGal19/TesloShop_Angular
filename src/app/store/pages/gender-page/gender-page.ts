import { ActivatedRoute } from '@angular/router';
import { Component, inject, signal } from '@angular/core';
import { ProductsService } from '@products/services/products.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { ProductCard } from "@products/components/product-card/product-card";

@Component({
  selector: 'gender-page',
  imports: [ProductCard],
  templateUrl: './gender-page.html',
})
export class GenderPage {
  productsService = inject(ProductsService);
  route = inject(ActivatedRoute);

  gender = toSignal(
    this.route.params.pipe(
      map(({ gender }) => gender),
    )
  )

  genderProductsResource = rxResource({
    params: () => ({
      gender: this.gender()
    }),
    stream: ({ params }) => {
      return this.productsService.getProducts({ gender: params.gender })
    }
  })
}
