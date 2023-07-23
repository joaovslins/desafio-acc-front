import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnterpriseListComponent } from './enterprise-list/enterprise-list.component';
import { EnterpriseFormComponent } from './enterprise-form/enterprise-form.component';

const routes: Routes = [
  { path: '', component: EnterpriseListComponent },
  { path: 'new', component: EnterpriseFormComponent },
  { path: ':id/edit', component: EnterpriseFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnterpriseRoutingModule { }
