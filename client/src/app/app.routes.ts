import { Routes } from '@angular/router';
import { OrderStatusComponent } from './features/order-status/order-status.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    component: OrderStatusComponent,
    title: 'Estado de Órdenes'
  },
  {
    path: '**',
    redirectTo: 'orders'
  }
];