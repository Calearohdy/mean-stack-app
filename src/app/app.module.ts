import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatCardModule, MatButtonModule,
    MatToolbarModule, MatExpansionModule, MatProgressSpinnerModule} from '@angular/material';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app-route.routing';

@NgModule({
   declarations: [
      AppComponent,
      PostCreateComponent,
      HeaderComponent,
      PostListComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      FormsModule,
      MatInputModule,
      MatCardModule,
      MatButtonModule,
      MatToolbarModule,
      MatExpansionModule,
      MatProgressSpinnerModule,
      HttpClientModule,
      RouterModule.forRoot(appRoutes)
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
