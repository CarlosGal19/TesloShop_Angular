import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { IProduct, IProductsResponse } from "@products/interfaces/product-response.interface";
import { Observable, of, tap } from "rxjs";
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
  private http = inject(HttpClient);

  private productsCache = new Map<string, IProductsResponse>();

  private singleProductCache = new Map<string, IProduct>();

  getProducts(options: IOptions): Observable<IProductsResponse> {

    const { limit = 9, offset = 0, gender = '' } = options;

    const mapKey = `${limit}-${offset}-${gender}`;

    if(this.productsCache.has(mapKey)) {
      return of(this.productsCache.get(mapKey)!);
    }

    return this.http.get<IProductsResponse>(`${baseUrl}/products`, {
      params: {
        limit,
        offset,
        gender
      }
    }).pipe(
      tap(data => {
        this.productsCache.set(mapKey, data)
      })
    )
  }

  getProductByTerm(term: string): Observable<IProduct> {
    const mapKey = term;

    if (this.singleProductCache.get(mapKey)) {
      return of(this.singleProductCache.get(mapKey)!)
    }

    return this.http.get<IProduct>(`${baseUrl}/products/${term}`)
      .pipe(
        tap(data => {
          this.singleProductCache.set(mapKey, data);
        })
      )
  }
}
