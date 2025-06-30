import { Routes } from '@angular/router';
import { DashboardComponent } from '../Pages/dashboard/dashboard.component';
import { HomeComponent } from '../Pages/home/home.component';
 

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, title: 'dashboard' },
];
