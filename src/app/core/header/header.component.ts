import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnDestroy, OnInit {


  subscription: Subscription | undefined;
  isLogged$ = this.authService.isLogged$;
  isReady$ = this.authService.isReady$;

  
  constructor(
    private authService: AuthService,
    private router: Router
    ){
      this.isLogged$.subscribe(isLogged => {
        console.log('header.component---isLogged ln24:',isLogged);
      });

      this.isReady$.subscribe(isReady => {
        console.log('header.component---isReady ln28:',isReady);
      });
  }


  // }
  

  // loginHandler(): void{
  //   this.userService.login('loginStr');
  // }

  logoutHandler(): void{
    this.authService.logout().subscribe(() => this.router.navigate(['/user/login']));
    
  }

  ngOnInit(): void {

  }
  ngOnDestroy(): void {

    // in this case this is not needed because this is a main component
    // so it will be destroyed when the application is removed (when we leave the app)
    // // but it's gopod practice to always unsubscribe to subscriptions
    this.subscription?.unsubscribe();
  }
}
