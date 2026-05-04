import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { ProductsService } from '@products/services/products.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductCard } from "@products/components/product-card/product-card";
import { Pagination } from "@shared/components/pagination/pagination";
import { PaginationService } from '@shared/components/services/pagination';

@Component({
  selector: 'gender-page',
  imports: [ProductCard, Pagination],
  templateUrl: './gender-page.html',
})
export class GenderPage {
  productsService = inject(ProductsService);
  route = inject(ActivatedRoute);
  paginationService = inject(PaginationService);

  gender = toSignal(
    this.route.params.pipe(
      map(({ gender }) => gender),
    )
  )

  genderProductsResource = rxResource({
    params: () => ({
      gender: this.gender(),
      page: this.paginationService.currentPage()
    }),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        gender: params.gender,
        limit: 12,
        offset: (params.page - 1) * 12
      })
    }
  })
}
