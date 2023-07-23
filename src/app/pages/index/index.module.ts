import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './Index.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: IndexComponent }
    ])
  ]
})
export class IndexModule { }
