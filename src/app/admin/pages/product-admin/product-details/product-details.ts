import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarousel } from '@products/components/product-carousel/product-carousel';
import { IProduct } from '@products/interfaces/product-response.interface';
import { ProductsService } from '@products/services/products.service';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {
  formBuilder = inject(FormBuilder);
  productsService = inject(ProductsService);
  router = inject(Router);

  product = input.required<IProduct>();

  wasSaved = signal(false);
  temporalImages = signal<string[]>([]);
  imagesFileList: FileList | null = null;

  carouselImages = computed(() => {
    return [...this.product().images, ...this.temporalImages()]
  })

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  productForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[] as string[]],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
  });

  ngOnInit() {
    this.setFormData(this.product());
  }

  setFormData(formLike: Partial<IProduct>) {
    this.productForm.reset(formLike as any);
    // this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join('') });
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();
    if (!isValid) return;

    const formData = this.productForm.value;

    const partialProduct: Partial<IProduct> = {
      ...(formData as any),
      tags:
        formData.tags
          ?.toLocaleLowerCase()
          .split(',')
          .map((t) => t.trim()) ?? [],
    };

    const productId = this.product().id;

    if (productId === 'new') {

      const product = await firstValueFrom(
        this.productsService.createProduct(partialProduct, this.imagesFileList)
      );

      this.router.navigate(['/admin/product', product.id]);
    } else {
      await firstValueFrom(
        this.productsService.updateProduct(productId, partialProduct, this.imagesFileList)
      );
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000)
  }

  onSizeChanges(size: string) {
    const currentSizes = [...(this.productForm.value.sizes ?? [])];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  onFilesChanges(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    this.imagesFileList = files;

    if (!files) return;

    const imageUrls =  Array.from(files ?? []).map(f => URL.createObjectURL(f));

    this.temporalImages.set(imageUrls);
  }
}
