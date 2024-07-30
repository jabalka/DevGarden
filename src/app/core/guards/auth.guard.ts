import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, from, of} from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateChildFn = (
  childRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    switchMap(user => {
      if(user){
        return of(true);
      } else {
        return from( router.navigate(['/login'])).pipe(
          map(() => false)
        );
      }
    })
  );
};
  // return authService.currentUser$.pipe(
  //   switchMap(user => {
  //     console.log('AuthGuard ln 16:00', user)
  //     if (user === null) {
  //       return authService.authenticate().pipe(
  //         map(authenticatedUser => !!authenticatedUser)
  //       );
  //     }
  //     return of(!!user);
  //   }),
  //   // map(isAuthenticated => {
  //   //   const isLoggedFromData = childRoute.data['isLogged'];
  //   //   return typeof isLoggedFromData !== 'boolean' || isLoggedFromData === isAuthenticated;
  //   // }),
  //   tap(isAllowed => {
  //     if (!isAllowed) {
  //       router.navigate(['/login']);
  //     }
  //   }),
  //   first()
  // );



// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard {
//   constructor(private userService: UserService, private router: Router) {}

//   canActivate: CanActivateFn = (
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
//     console.log(this.userService)
//     let stream$: Observable<IUser | null>;
//     if (this.userService.currentUser === undefined) {
//       stream$ = this.userService.getCurrentUserProfile();
//     } else {
//       stream$ = of(this.userService.currentUser);
//     }

//     return stream$.pipe(
//       map((user: IUser | null) => {
//         const isLoggedFromData = route.data["isLogged"];
//         if (typeof isLoggedFromData === 'boolean' && isLoggedFromData === !!user) {
//           return true;
//         } else {
//           this.router.navigate(['/']);
//           return false;

//         }
//       })
//     );
//   }
// }
