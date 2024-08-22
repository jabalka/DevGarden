import { Store } from '@ngrx/store';
import { IAuthState } from './auth/reducers';
import { authenticate, setUserSuccess } from './auth/actions';

export function loadAuthState(store: Store< {auth: IAuthState}>) {
    return () => {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          const authState = localStorage.getItem('authState');
          if (authState) {
            const parsedAuthState = JSON.parse(authState);
            if(parsedAuthState.currentUser){
              store.dispatch(authenticate({user: null}));
            } else {
              localStorage.removeItem('authState');
              localStorage.removeItem('currentUser');
            }
          }
        }
      };
    }