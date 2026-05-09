import { Routes } from "@angular/router";
import { AdminLayout } from "./layouts/admin-layout/admin-layout";
import { ProductsAdmin } from "./pages/products-admin/products-admin";
import { ProductAdmin } from "./pages/product-admin/product-admin";

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: 'products',
        component: ProductsAdmin
      },
      {
        path: 'product/:productId',
        component: ProductAdmin
      },
      {
        path: '**',
        redirectTo: 'products'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
]

export default adminRoutes;
