import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { UsageDetailsComponent } from './components/usageDetails/usagedetails.component';
import { DownloadComponent } from './components/download/download.component';
import { ConfigurationComponent } from './components/configuration/configuration.component'

export const routes: Routes = [
    {path:'login', component:LoginComponent},
    { path: 'usagedetails', component: UsageDetailsComponent },
    {path:'download', component:DownloadComponent},
    {path:'configuartion', component: ConfigurationComponent},

    {path:'', redirectTo:'login', pathMatch:'full'}
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }