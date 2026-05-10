import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { IUser } from "@auth/interfaces/user.interface";
import { IGender, IProduct, IProductsResponse } from "@products/interfaces/product-response.interface";
import { Observable, of, tap } from "rxjs";
import { environment } from "src/environments/environment";

const baseUrl = environment.baseUrl;

interface IOptions {
  limit?: number;
  offset?: number;
  gender?: 'men' | 'women' | 'kid' | 'unisex'
}

const emptyProduct: IProduct = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: IGender.Men,
  tags: [],
  images: [],
  user: {} as IUser,
};

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

    if (term === 'new') {
      return of(emptyProduct);
    }

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

  updateProduct(id: string, likeProduct: Partial<IProduct>) {

    return this.http.patch<IProduct>(`${baseUrl}/products/${id}`, {
      ...likeProduct
    }).pipe(
      tap(product => {
        this.updateCache(id, product);
      })
    )
  }

  updateCache(id: string, newProduct: IProduct) {
    this.singleProductCache.set(id, newProduct);

    this.productsCache.forEach(productsResponse => {
      productsResponse.products = productsResponse.products.map(product => product.id === id ? newProduct : product );
    })
  }
}
