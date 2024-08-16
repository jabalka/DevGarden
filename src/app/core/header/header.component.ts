import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { IUser, UserModel } from '../../user/user.model';
import { Store, select } from '@ngrx/store';
import { IAppState } from '../../+store';
import { selectCurrentUser } from '../../+store/selectors';
import { setUser } from '../../+store/auth/actions';
import { NavigationService } from '../navigation.service';

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
    private navigationService: NavigationService,
    private router: Router,
    private store: Store<IAppState>
    ){
    // this.authService.isLogged$.subscribe(value => this.isLogged$ = value);
      // this.isLogged$.subscribe(isLogged => {
      // });
      // this.isReady$.subscribe(isReady => {
      // });
  }


  logoutHandler(): void{
    this.authService.logout().subscribe(() => this.router.navigate(['/']));
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getUsername(user: UserModel | null): string {
    if(user && user.username){
      return user.username;
    }
    return user!.email.split('@')[0];;
  }

  redirect2Login(){
    this.navigationService.clearCurrentPage();
    this.router.navigate(['/login']);
  }

  redirect2Register(){
    this.navigationService.clearCurrentPage();
    this.router.navigate(['/register']);
  }

  redirect2Profile(){
    this.navigationService.clearCurrentPage();
    this.router.navigate(['/profile']);
  }

  redirect2Projects(){
    this.navigationService.clearCurrentPage();
    this.router.navigate(['/projects']);
  }

  redirect2MyProjects(){
    this.navigationService.clearCurrentPage();
    this.router.navigate(['/my-projects']);
  }

  redirect2NewProject(){
    this.navigationService.clearCurrentPage();
    this.router.navigate(['/projects/new']);
  }
}
