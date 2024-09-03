import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, from, of} from 'rxjs';
import { finalize, first, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { LoadingService } from '../../loading.service';

export const isGuest: CanActivateChildFn = (
  childRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const loadingService = inject(LoadingService);

  loadingService.show();
  return authService.currentUser$.pipe(
    switchMap(user => {
      if(user){return from( router.navigate(['user/profile'])).pipe(
        map(() => false)
      ); 
      } else {
        return of(true);
      }
    }),
    finalize(() => {
      loadingService.hide();
    })
  );
};
