import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    ProjectDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([OwnerEffects]),
    AppRoutingModule,
    CoreModule,
    UserModule
  ],
  providers: [
    provideClientHydration(),
    AuthService,
    ProjectService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
