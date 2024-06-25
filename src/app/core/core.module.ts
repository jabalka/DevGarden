import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth.service';



@NgModule({
  declarations: [
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule, 
  ],
  providers: [
    AuthService
  ],
  exports: [
    HeaderComponent,
  ]
})
export class CoreModule { }
