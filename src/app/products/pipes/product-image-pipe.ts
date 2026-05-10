import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {

  transform(value: string | string[]): string {

    if ((Array.isArray(value) && value.length === 0)  || !value) {
      return `/assets/images/placeholder.jpg`;
    }

    if (Array.isArray(value) && value.length > 0) {
      return `${baseUrl}/files/product/${value[0]}`
    }

    return `${baseUrl}/files/product/${value}`

  }

}
