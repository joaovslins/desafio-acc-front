import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { MultiSelectModule } from 'primeng/multiselect';

import { ProviderRoutingModule } from './provider-routing.module';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { ProviderFormComponent } from './provider-form/provider-form.component';
import { IMaskModule } from 'angular-imask';

@NgModule({
  declarations: [
    ProviderListComponent,
    ProviderFormComponent
  ],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    ReactiveFormsModule,
    IMaskModule,
    FormsModule,
    MultiSelectModule
  ]
})
export class ProviderModule { }
