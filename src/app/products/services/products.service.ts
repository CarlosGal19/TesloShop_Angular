import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { IUser } from "@auth/interfaces/user.interface";
import { IGender, IProduct, IProductsResponse } from "@products/interfaces/product-response.interface";
import { forkJoin, map, Observable, of, switchMap, tap } from "rxjs";
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

  updateProduct(id: string, likeProduct: Partial<IProduct>, images: FileList | null) {

    const currentImages = likeProduct.images ?? [];

    return this.uploadImages(images)
      .pipe(
        map(imageNames => ({
          ...likeProduct,
          images: [...currentImages, ...imageNames]
        })),
        // switchMap receives data from the last observable and subscribes to the observable you put inside
        switchMap(updatedProduct =>
          this.http.patch<IProduct>(`${baseUrl}/products/${id}`, updatedProduct)
        ),
        tap(product => {
          this.updateCache(id, product)
        })
      )
  }

  createProduct(newProduct: Partial<IProduct>, images: FileList | null) {

    const currentImages = newProduct.images ?? [];

    return this.uploadImages(images)
      .pipe(
        map(imageNames => ({
          ...newProduct,
          images: [...currentImages, imageNames]
        })),
        switchMap(updatedProduct =>
          this.http.post<IProduct>(`${baseUrl}/products`, updatedProduct)
        ),
        tap(product => {
          this.updateCache(product.id, product);
        })
      )
  }

  updateCache(id: string, newProduct: IProduct) {
    this.singleProductCache.set(id, newProduct);

    if (id === 'new') return;

    this.productsCache.forEach(productsResponse => {
      productsResponse.products = productsResponse.products.map(product => product.id === id ? newProduct : product );
    })
  }

  uploadImages(imagesList: FileList | null): Observable<string[]> {
    if (!imagesList) return of([]);

    const uploadedObservables = Array.from(imagesList)
      .map(image => this.uploadSingleImage(image));

    // forkJoin waits until all observables return a value
    return forkJoin(uploadedObservables)
  }

  uploadSingleImage(image: File): Observable<string> {
    const formData = new FormData();

    formData.append('file', image);

    return this.http.post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
      .pipe(
        map(response => response.fileName)
      )
  }
}
