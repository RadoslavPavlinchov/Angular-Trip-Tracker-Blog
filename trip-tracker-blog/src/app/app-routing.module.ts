import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard} from "./shared/guards/auth.guard";
import { ContainerAppComponent } from "./components/pages/container-app/container-app.component";
import { DetailsPostComponent } from './components/posts/details-post/details-post.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component'

const routes: Routes = [
  {
    path: '', component: ContainerAppComponent, children: [
      {
        path: 'home', loadChildren: () => import('./components/pages/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'post/:id', component: DetailsPostComponent, canActivate: [ AuthGuard ],
      },
      {
        path: 'about', loadChildren: () => import('./components/pages/about/about.module').then(m => m.AboutModule)
      },
      {
        path: '', redirectTo: 'home', pathMatch: 'full'
      }
    ]
  },
  {
    path: 'admin', loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule)
  },
  { 
    path: 'login', loadChildren: () => import('./components/auth/login/login.module').then(m => m.LoginModule) 
  },
  { 
    path: 'sign-up', loadChildren: () => import('./components/auth/sign-up/sign-up.module').then(m => m.SignupModule) 
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
