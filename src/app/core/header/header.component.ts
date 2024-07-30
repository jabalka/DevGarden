import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { IUser, UserModel } from '../../user/user.model';
import { Store, select } from '@ngrx/store';
import { IAppState } from '../../+store';
import { selectCurrentUser } from '../../+store/selectors';
import { setUser } from '../../+store/auth/actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnDestroy, OnInit {


  subscription: Subscription | undefined;
  // isLogged$?: boolean;
  isLogged$ = this.authService.isLogged$;
  isReady$ = this.authService.isReady$;
  currentUser$ = this.authService.currentUser$;

  // currentUser: UserModel = {} as UserModel;
  currentUser = this.authService.currentUser;
  currentUserSubscription?: Subscription;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<IAppState>
    ){
    // this.authService.isLogged$.subscribe(value => this.isLogged$ = value);
      // this.isLogged$.subscribe(isLogged => {
      // });
      // this.isReady$.subscribe(isReady => {
      // });
  }

  // loginHandler(): void{
  //   this.userService.login('loginStr');
  // }

  logoutHandler(): void{
    this.authService.logout().subscribe(() => this.router.navigate(['/']));
    
  }

  ngOnInit(): void {
  //   this.currentUserSubscription = this.store.pipe(select(selectCurrentUser))
  //   .subscribe((user: IUser | UserModel | null) => {
  //     if(user){
  //       Object.assign(this.currentUser, user)
  //                // get just the first part of the email to use as greeting------
  //         this.currentUser.username = user.email.split('@')[0];
  //     }
  // },
  // error => console.error('Error fetching owner:', error));
  }
  ngOnDestroy(): void {

    // in this case this is not needed because this is a main component
    // so it will be destroyed when the application is removed (when we leave the app)
    // // but it's gopod practice to always unsubscribe to subscriptions
    this.subscription?.unsubscribe();
  }

  getUsername(user: UserModel | null): string {
    if(user && user.username){
      return user.username;
    }
    return user!.email.split('@')[0];;
  }
}
