import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, from, of} from 'rxjs';
import { catchError, finalize, first, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { LoadingService } from '../../loading.service';

export const authGuard: CanActivateChildFn = (
  childRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const loadingService = inject(LoadingService);

  loadingService.show();

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



//   return authService.currentUser$.pipe(
//     first(),
//     switchMap(user => {
//       if(user){
//         return of(true);
//       } else {
//         return from( router.navigate(['/login'])).pipe(
//           map(() => false)
//         );
//       }
//     }),
//     finalize(() => {
//       loadingService.hide();
//     }),
//     catchError(() => {
//       loadingService.hide();
//       return of(false);
//     })
//   );
// };
