import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { IProductsResponse } from "@products/interfaces/product-response.interface";
import { tap } from "rxjs";
import { environment } from "src/environments/environment";

const baseUrl = environment.baseUrl;

interface IOptions {
  limit?: number;
  offset?: number;
  gender?: 'men' | 'women' | 'kid' | 'unisex'
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient)

  getProducts(options: IOptions) {

    const { limit = 9, offset = 0, gender = '' } = options

    return this.http.get<IProductsResponse>(`${baseUrl}/products`, {
      params: {
        limit,
        offset,
        gender
      }
    })
      .pipe(tap(d =>  console.log(d)))
  }
}
