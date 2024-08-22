import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';

import { StoreModule } from '@ngrx/store';
import { reducers } from './+store';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { OwnerEffects } from './+store/owner/effects';
import { UserModule } from './user/user.module';
import { AuthService } from './core/auth.service';
import { ProjectService } from './project/project.service';
import { SharedModule } from './shared/shared.module';
import { AuthEffects } from './+store/auth/effects';
import { ProjectModule } from './project/project.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([OwnerEffects, AuthEffects]),
    AppRoutingModule,
    CoreModule,
    UserModule,
    SharedModule,
    ProjectModule,
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    provideClientHydration(),
    AuthService,
    ProjectService,
    provideHttpClient(withFetch())

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
