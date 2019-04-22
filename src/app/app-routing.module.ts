import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';

/**
 * Route Definitions
 * These should only be primary routes to lazy loaded sub modules
 */
const appRoutes: Routes = [
	{
		path: 'basicform',
		loadChildren: './basic-form/basic-form.module#BasicFormModule'
	}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
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
