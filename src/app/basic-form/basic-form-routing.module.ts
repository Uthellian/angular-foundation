import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicFormComponent } from './basic-form/basic-form.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';

const routes: Routes = [
  {
    path: '',
    component: BasicFormComponent
  },
  {
    path: 'dynamicform',
    component: DynamicFormComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class BasicFormRoutingModule {}