import { Component, inject, signal } from '@angular/core';
import { Pagination } from "@shared/components/pagination/pagination";
import { ProductsTable } from "@products/components/products-table/products-table";
import { ProductsService } from '@products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationService } from '@shared/components/services/pagination';
import { tap } from 'rxjs';

@Component({
  selector: 'products-admin',
  imports: [Pagination, ProductsTable],
  templateUrl: './products-admin.html',
})
export class ProductsAdmin {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  productsPerPage = signal(10);

  productsResource = rxResource({
    params: () => ({
      limit: this.productsPerPage(),
      page: this.paginationService.currentPage()
    }),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        limit: params.limit,
        offset: (params.page - 1) * params.limit
      }).pipe(
        tap(data => {
          console.log(data);
        })
      );
      }
  })
}
