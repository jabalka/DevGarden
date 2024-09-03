import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { UserModel } from '../../user/user.model';
import { Store } from '@ngrx/store';
import { IAppState } from '../../+store';
import { NavigationService } from '../navigation.service';
import { environment } from '../../environments/environment';
import { UserService } from '../../user/user.service';

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
  profilePictureUrl: string | null = null;

  // currentUser: UserModel = {} as UserModel;
  currentUser = this.authService.currentUser;
  currentUserSubscription?: Subscription;
  profilePicChangeSubscription?: Subscription;
  authSubscription?: Subscription;
  
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private navigationService: NavigationService,
    private router: Router,
    private store: Store<IAppState>
    ){

  }

  ngOnInit(): void {
    // if (this.currentUser.profilePicture) {
    //   this.profilePictureUrl = `${environment.apiUrl}uploads/profilePics/${this.currentUser.profilePicture}`;
    // }

    // subscribe to profile pic changes
    this.profilePicChangeSubscription = this.userService.profilePicChange$.subscribe(newProfilePicUrl => {
      if(newProfilePicUrl){
        this.profilePictureUrl = newProfilePicUrl;
      }
    });

    // subscribe to auth state changes
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.updateProfilePictureUrl(user);
    })
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.profilePicChangeSubscription?.unsubscribe();
  }

  updateProfilePictureUrl(user: UserModel | null): void {
    if( user && user.profilePicture) {
      this.profilePictureUrl = `${environment.apiUrl}uploads/profilePics/${user.profilePicture}`;
    } else {
      this.profilePictureUrl = null;
    }
  }

  getUsername(user: UserModel | null): string {
    if(user && user.username){
      return user.username;
    }
    return user!.email.split('@')[0];;
  }

  logoutHandler(): void{
    this.authService.logout().subscribe(() => this.router.navigate(['/']));
    this.profilePictureUrl = null
  }

  redirect2Login(){
    this.navigationService.clearCurrentPage();
    this.router.navigate(['/user/login']);
  }

  redirect2Register(){
    this.navigationService.clearCurrentPage();
    this.router.navigate(['/user/register']);
  }

  redirect2Profile(){
    this.navigationService.clearCurrentPage();
    this.router.navigate(['/user/profile']);
  }

  redirect2Projects(){
    this.navigationService.clearCurrentPage();
    this.router.navigate(['/projects']);
  }

  redirect2MyProjects(){
    this.navigationService.clearCurrentPage();
    this.router.navigate(['/projects/my-projects']);
  }

  redirect2NewProject(){
    this.navigationService.clearCurrentPage();
    this.router.navigate(['/projects/new']);
  }
}
