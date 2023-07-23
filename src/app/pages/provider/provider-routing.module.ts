import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { ProviderFormComponent } from './provider-form/provider-form.component';

const routes: Routes = [
  { path: '', component: ProviderListComponent },
  { path: 'new', component: ProviderFormComponent },
  { path: ':id/edit', component: ProviderFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule { }
