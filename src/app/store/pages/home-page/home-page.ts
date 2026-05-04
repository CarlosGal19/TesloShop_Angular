import { ProductsService } from '@products/services/products.service';
import { Component, inject } from '@angular/core';
import { ProductCard } from '@products/components/product-card/product-card';
import { rxResource } from '@angular/core/rxjs-interop'
import { Pagination } from "@shared/components/pagination/pagination";
import { PaginationService } from '@shared/components/services/pagination';

@Component({
  selector: 'home-page',
  imports: [
    ProductCard,
    Pagination
],
  templateUrl: './home-page.html',
})
export class HomePage {
  private productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  productsResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage()
    }),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        limit: 12,
        offset: (params.page - 1) * 12
      });
    },
  });
}
