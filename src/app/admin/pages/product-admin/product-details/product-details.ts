import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";
import { IProduct } from '@products/interfaces/product-response.interface';
import { ProductsService } from '@products/services/products.service';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabel } from "@shared/components/form-error-label/form-error-label";

@Component({
  selector: 'product-details',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {
  formBuilder = inject(FormBuilder);
  productsService = inject(ProductsService);

  product = input.required<IProduct>();

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  productForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      slug: [
        '',
        [Validators.required, Validators.pattern(FormUtils.slugPattern)],
      ],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      sizes: [['']],
      images: [[]],
      tags: [''],
      gender: [
        'men',
        [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
      ],
    });

  ngOnInit() {
    this.setFormData(this.product());
  }

  setFormData(formLike: Partial<IProduct>) {
    this.productForm.reset(formLike as any)
    // this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({ 'tags': formLike.tags?.join('') });
  }

  onSubmit() {
    console.log(this.productForm.value)
  }

  onSizeChanges(size: string) {
    const currentSizes = [...this.productForm.value.sizes ?? []];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1)
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });

  }
}
