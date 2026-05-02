import { Routes } from "@angular/router";
import { StoreLayout } from "./layouts/store-layout/store-layout";
import { HomePage } from "./pages/home-page/home-page";
import { GenderPage } from "./pages/gender-page/gender-page";
import { ProductPage } from "./pages/product-page/product-page";
import { NotFoundPage } from "./pages/not-found-page/not-found-page";

export const storeRoutes: Routes = [
  {
    path: '',
    component: StoreLayout,
    children: [
      {
        path: '',
        component: HomePage
      },
      {
        path: 'gender/:gender',
        component: GenderPage
      },
      {
        path: 'product/:id',
        component: ProductPage
      },
      {
        path: '**',
        component: NotFoundPage
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

export default storeRoutes;
