import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth.service';
import { authGuard } from './guards/auth.guard new';
import { ConfirmDelDialogComponent } from './account-del-dialog/confirm-del-dialog.component';



@NgModule({
  declarations: [
    ConfirmDelDialogComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule, 

  ],
  providers: [
    AuthService,

  ],
  exports: [
    HeaderComponent,
  ]
})
export class CoreModule { }
