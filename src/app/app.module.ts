import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app-route.routing';
import { AuthInterceptor } from './services/auth-interceptor';
import { AuthGuard } from './guards/auth.guard';
import { ErrorInterceptor } from './services/error-interceptor';
import { ErrorModalComponent } from './modals/error-modal/error-modal.component';
import { AngularMaterialModule } from './angular-material.module';
import { PostModule } from './posts/posts.module';

@NgModule({
   declarations: [
      AppComponent,
      HeaderComponent,
      ErrorModalComponent
   ],
   imports: [
      PostModule,
      BrowserModule,
      BrowserAnimationsModule,
      FormsModule,
      HttpClientModule,
      AngularMaterialModule,
      RouterModule.forRoot(appRoutes)
   ],
   providers: [
       {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
       {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    AuthGuard],
   bootstrap: [
      AppComponent
   ],
   entryComponents: [ErrorModalComponent] // root modals
})
export class AppModule { }
