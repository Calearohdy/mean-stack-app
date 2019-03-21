import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule, MatCardModule, MatButtonModule,
    MatToolbarModule, MatExpansionModule, MatProgressSpinnerModule,
    MatPaginatorModule, MatDialogModule} from '@angular/material';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app-route.routing';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthInterceptor } from './services/auth-interceptor';
import { AuthGuard } from './guards/auth.guard';
import { ErrorInterceptor } from './services/error-interceptor';
import { ErrorModalComponent } from './modals/error-modal/error-modal.component';

@NgModule({
   declarations: [
      AppComponent,
      PostCreateComponent,
      HeaderComponent,
      PostListComponent,
      LoginComponent,
      RegisterComponent,
      ErrorModalComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      ReactiveFormsModule,
      FormsModule,
      MatInputModule,
      MatCardModule,
      MatButtonModule,
      MatToolbarModule,
      MatExpansionModule,
      MatProgressSpinnerModule,
      MatPaginatorModule,
      MatDialogModule,
      HttpClientModule,
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
