import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'provider', loadChildren: () => import('./pages/provider/provider.module').then(m => m.ProviderModule) },
  { path: 'enterprise', loadChildren: () => import('./pages/enterprise/enterprise.module').then(m => m.EnterpriseModule) },
  { path: '', loadChildren: () => import('./pages/index/index.module').then(m => m.IndexModule) }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
