import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DownloadComponent } from './components/download/download.component';

export const routes: Routes = [
    {path:'login', component:LoginComponent},
    { path: 'dashboard', component: DashboardComponent },
    {path:'download', component:DownloadComponent},

    {path:'', redirectTo:'login', pathMatch:'full'}
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }