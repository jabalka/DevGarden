import { NgModule } from '@angular/core';
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
import { NewProjectComponent } from './project/new-project/new-project.component';
import { ConfirmDelDialogComponent } from './core/account-del-dialog/confirm-del-dialog.component';
import { ProjectModule } from './project/project.module';
import { ProjectEditComponent } from './project/project-edit/project-edit.component';

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
  providers: [
    provideClientHydration(),
    AuthService,
    ProjectService,
    provideHttpClient(withFetch())

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
