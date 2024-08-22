import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { UserService } from './user.service';
import { Store, StoreModule } from '@ngrx/store';
import { reducers } from '../+store/user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { loadAuthState } from '../+store/load-auth-state';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    StoreModule.forFeature('user', reducers),

    SharedModule,
    RouterModule,
  ],
  providers: [
    UserService,
        {
      provide: APP_INITIALIZER,
       useFactory: loadAuthState,
       deps: [Store],
       multi: true
    }
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
  ]
})
export class UserModule { }
