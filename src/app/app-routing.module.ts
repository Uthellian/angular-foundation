import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: []
  },
	{
		path: 'basicform',
		loadChildren: './basic-form/basic-form.module#BasicFormModule'
	}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        enableTracing: false // <-- debugging purposes only
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
