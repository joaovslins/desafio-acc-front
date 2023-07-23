import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from 'angular-imask';
import { MultiSelectModule } from 'primeng/multiselect';

import { EnterpriseRoutingModule } from './enterprise-routing.module';
import { EnterpriseListComponent } from './enterprise-list/enterprise-list.component';
import { EnterpriseFormComponent } from './enterprise-form/enterprise-form.component';


@NgModule({
  declarations: [
    EnterpriseListComponent,
    EnterpriseFormComponent
  ],
  imports: [
    CommonModule,
    EnterpriseRoutingModule,
    ReactiveFormsModule,
    IMaskModule,
    MultiSelectModule
  ]
})
export class EnterpriseModule { }
