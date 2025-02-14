import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'welcome', loadComponent: () => import('./pages/welcome/welcome.component').then(m => m.WelcomeComponent) },
      { path: 'booking-list', loadComponent: () => import('./booking-list/booking-list.component').then(m => m.BookingListComponent) },
      { path: 'device-token', loadComponent: () => import('./device-token/device-token.component').then(m => m.DeviceTokenListComponent) },
      { path: 'notifications-list', loadComponent: () => import('./notifications-list/notifications-list.component').then(m => m.NotificationsListComponent) },
      { path: 'push-notification', loadComponent: () => import('./push-notification/push-notification.component').then(m => m.PushNotificationComponent) },
      { path: 'transaction-callback-search', loadComponent: () => import('./transaction-callback-search/transaction-callback-search.component').then(m => m.TransactionCallbackSearchComponent) },
      { path: 'route-management', loadComponent: () => import('./route-management/route-management.component').then(m => m.RouteManagementComponent) },
      { path: 'branches-management', loadComponent: () => import('./branches-management/branches-management.component').then(m => m.BranchesManagementComponent) },
      { path: 'promotion-management', loadComponent: () => import('./promotion-management/promotion-management.component').then(m => m.PromotionManagementComponent) },
      { path: 'membership', loadComponent: () => import('./membership/membership.component').then(m => m.MembershipComponent) },
      { path: 'tour-list', loadComponent: () => import('./tour-list/tour-list.component').then(m => m.TourListComponent) },
      { path: 'feedback-list', loadComponent: () => import('./feedback-list/feedback-list.component').then(m => m.FeedbackListComponent) },
      { path: 'book-tours-list', loadComponent: () => import('./book-tours-list/book-tours-list.component').then(m => m.BookToursListComponent) },
      { path: '', redirectTo: '/welcome', pathMatch: 'full' }
    ]
  }
];
