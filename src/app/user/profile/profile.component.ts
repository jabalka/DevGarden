import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService, apiUrl } from '../user.service';
import { Observable, catchError, first, forkJoin, of, switchMap } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { Store, select } from '@ngrx/store';
import { IUserModuleState } from '../../+store/user';
import { userProfileSetEditMode, userProfileSetErrorMessage, userProfileSetLoading } from '../../+store/user/actions';
import { clearUserData, logout, updateUser } from '../../+store/auth/actions';
import { IUser, UserModel } from '../user.model';
import { selectCurrentUser } from '../../+store/selectors';
import { UserModule } from '../user.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordValidator, rePasswordValidatorFactory } from '../../shared/interfaces/validators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDelDialogComponent } from '../../core/account-del-dialog/confirm-del-dialog.component';
import { ProjectService } from '../../project/project.service';
import { ObjectId } from 'bson';
import { Project } from '../../project/project.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {

  form: FormGroup;
  formPass: FormGroup;
  formPassCheck: FormGroup;
  selectedFile: File | null = null;
  profilePictureUrl: string | null = null;

  inEditMode$: Observable<boolean>;
  isLoading$ = this.store.select(state => state.user.profile.isLoading);
  currentUser$ = this.authService.currentUser$;
  userId?: string;
  currentUser: UserModel = {} as UserModel;
  inAdvancedSettings: boolean = false;
  inAdvancedChange : boolean = false;
  isPassChecked: boolean = false;
  inDeleteAccount: boolean = false;
  inPassChange: boolean = false;
  errorMessage: string = '';
  isPasswordVisible: boolean = false;
  isRePasswordVisible: boolean = false;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private projectService: ProjectService,
    private store: Store<IUserModuleState>,
    private router: Router,
  ){
    this.inEditMode$ = this.store.select(state => state.user.profile.isEditMode);
    this.form = this.fb.group({
      username: [''],
      name: [''],
      phone: ['']
    });
    const passwordControl = this.fb.control('', [
      Validators.required,
      passwordValidator,
    ]);;
    this.formPass = this.fb.group({
      password: passwordControl,
      rePassword: ['', [Validators.required, rePasswordValidatorFactory(passwordControl)]],
    });
    this.formPassCheck = this.fb.group({
      password: ['', [Validators.required]],
    });

  }

  onFileSelected(event: any){
    this.selectedFile = event.target.files[0];
  }

  uploadProfilePicture(){
    if (!this.selectedFile) return;

    this.userService.uploadProfilePicture(this.selectedFile).subscribe({
      next: (response) => {
        this.profilePictureUrl = `${environment.apiUrl}uploads/profilePics/${response.profilePicture}`
      },
      error: (err) => {
        console.error('Error uploading profile picture', err);
      }
    })
  }
// this.currentUser$ returns only the email and password, not the username, name etc.

  ngOnInit(): void {
    this.store.select(state => state.auth.currentUser).subscribe(user => {
      // Check if profilePicture is included
    });
    this.currentUser$.pipe(
      switchMap((user: IUser | UserModel | null) => {
        if (user){
          if('username' in user){
            this.currentUser = {...user} as UserModel;
            // Set profilePictureUrl if user.profilePicture is available
            if (this.currentUser.profilePicture) {
              this.profilePictureUrl = `${environment.apiUrl}uploads/profilePics/${this.currentUser.profilePicture}`;
            }
          } else {
            const updatedUser: UserModel = {
              _id: user._id,
              email: user.email,
              hashedPassword: user.hashedPassword,
              username: user.email.split('@')[0],
              name: '',
              phone: '',
              profilePicture: ''
          };
          this.currentUser = updatedUser;
          }
          this.form.patchValue({
            username: this.currentUser.username,
            name: this.currentUser.name,
            phone: this.currentUser.phone
          });

          if(this.currentUser._id){
            this.userId = this.currentUser._id.toString();
          }
        }
        return of(user);
      })
    ).subscribe();
    // this.currentUser$.subscribe((user: IUser | UserModel | null) => {
    //   console.log('profile.component ln36:', user)
    //   if(user){
    //     Object.assign(this.currentUser, user);
    //     if(this.currentUser.username === '')
    //     this.currentUser.username = user.email.split('@')[0];
    //   if(this.currentUser._id){
    //     // this.userId = this.currentUser._id.toString();
    //     // console.log('profile.component ln39:',this.userId)
    //   }
    //   }
    // })
  //  this.isEditMode$ = this.store.select(state => state.user.profile.isEditMode);
  }
  ngOnDestroy():void {
    this.store.dispatch(userProfileSetEditMode({isEdit: false}));
    this.inAdvancedSettings = false;
  }

  toggleEditMode(): void {
    this.inEditMode$.pipe(first()).subscribe(isEditMode => {
      this.store.dispatch(userProfileSetEditMode({isEdit: !isEditMode}));
    });
  }

  toggleAdvancedSettings(): void {
    this.inAdvancedSettings = !this.inAdvancedSettings;
    this.isPassChecked = false;
    this.inAdvancedChange = false;
    this.isPasswordVisible = false;
    this.isRePasswordVisible = false;
    this.formPass.get('password')?.reset();
    this.formPassCheck.get('password')?.reset();
    this.formPass.get('password')?.markAsUntouched();
    this.formPassCheck.get('password')?.markAsUntouched();
  }

  toggleChangePass(): void {
    // this.inAdvancedSettings = !this.inAdvancedSettings;
    this.inAdvancedChange = !this.inAdvancedChange;
    this.inPassChange = true;
    this.isPassChecked = false;
    this.isPasswordVisible = false;
    this.isRePasswordVisible = false;
    this.formPass.get('password')?.markAsUntouched();
    this.formPassCheck.get('password')?.markAsUntouched();
  }

  backBtn(): void {
    if(this.isPassChecked){
      this.formPassCheck.get('password')?.markAsUntouched();
      this.formPassCheck.get('password')?.reset();
      this.isPassChecked = false;
      this.isPasswordVisible = false;
      this.isRePasswordVisible = false;
    } else if (this.inAdvancedChange){
      this.formPass.get('password')?.markAsUntouched();
      this.formPass.get('password')?.reset();
      this.inAdvancedChange = false;
      this.isPasswordVisible = false;
      this.isRePasswordVisible = false;
    } else if (this.inAdvancedSettings){
      this.inAdvancedSettings = false;
    }
  }

  deleteAccountHandler(){
    this.inAdvancedChange = true;
    this.isPassChecked = false;
    this.inDeleteAccount = true;
  }

  togglePassChange(): void {
    this.isPassChecked = !this.isPassChecked;
    this.isPasswordVisible = false;
    this.isRePasswordVisible = false;
  }

  submitPassChecker(): void{
    const data = this.formPassCheck.value;
    const email = this.currentUser.email;
    if(this.formPassCheck.valid){
      this.authService.verifyPass({ email, password: data.password}).subscribe({
        next: () => {
          this.errorMessage = '';
          if(this.inDeleteAccount && !this.isPassChecked){
            this.isPassChecked = true;
            this.openConfirmDialog();
          } else if (this.inPassChange && !this.inDeleteAccount){
            this.togglePassChange();
          }
        },
        error: (error) => {
          this.errorMessage = error.error.message;
        }
      });
    } else {
      this.formPassCheck.markAllAsTouched();
    }
    this.isPasswordVisible = false;
    this.isRePasswordVisible = false;
  }

  submitPassChange(): void {
    const data = this.formPass.value;
    if(data.password){
      this.toggleAdvancedSettings();
      this.currentUser = {
        _id: this.currentUser._id,
        email: this.currentUser.email,
        hashedPassword: data.password,
        username: this.currentUser.username,
        name: this.currentUser.name,
        phone: this.currentUser.phone,
        profilePicture: this.currentUser.profilePicture
      }
      this.store.dispatch(userProfileSetLoading({ isLoading: true }));
      this.userService.updateProfile(this.currentUser).subscribe({
        next: () => {
          this.store.dispatch(userProfileSetEditMode({ isEdit: false }));;
          this.store.dispatch(userProfileSetLoading({isLoading: false}));
        },
        error: (err) => {
          this.store.dispatch(userProfileSetErrorMessage({ message: err.error.message }));
          this.store.dispatch(userProfileSetLoading({isLoading: false}));
        }
      })
    } else {
      this.formPass.get('password')?.setErrors({ required: true });
      this.formPass.get('password')?.markAsTouched();
    }
    this.formPass.get('password')?.reset();
    this.formPass.get('rePassword')?.reset();
    this.inPassChange = false;
    this.isPasswordVisible = false;
    this.isRePasswordVisible = false;
  }

  submitHandler(): void {
    const data = this.form.value;
    if(!data.username.trim() || data.username === ""){
      const confirmGenerateUsername = confirm('Username is empty. It will be automatically generated based on your email. Do you want to proceed?');
      if (confirmGenerateUsername) {
        data.username = this.currentUser.email.split('@')[0];
      } else {
        return;
      }
    }
    this.currentUser = {
      ...this.currentUser,
      username: data.username,
      name: data.name,
      phone: data.phone,
    }

    this.store.dispatch(userProfileSetLoading({ isLoading: true }));
    this.userService.updateProfile(this.currentUser).subscribe({
      next: () => {
        this.store.dispatch(userProfileSetEditMode({ isEdit: false }));;
        this.store.dispatch(userProfileSetLoading({isLoading: false}));
        // by doing this it will save only the data passed to the "updateUser()"
        // this.store.dispatch(updateUser({ user: this.currentUser }));
      },
      error: (err) => {
        this.store.dispatch(userProfileSetErrorMessage({ message: err.error.message }));
        this.store.dispatch(userProfileSetLoading({isLoading: false}));
      }
    })
  }

  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDelDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteAccount();
      } else {
        this.inAdvancedSettings = false;
        this.inAdvancedChange = false;
        this.isPassChecked = false;
        this.inDeleteAccount = false;
      }
    })
  }

  deleteAccount(): void {
    const id = this.currentUser._id;
    const adminId = '66a913c2df66e5fd8b3e78cc';

    // all projects owned by the user
    this.projectService.getProjectsByOwner(id.toString()).pipe(
        switchMap((projectsData: { projects: Project[], totalProjects: number }) => {
            const projects = projectsData.projects;

            // check if there are projects to update
            if (projects.length > 0) {
                // If there are projects, update their ownership
                const projectUpdates = projects.map(project => {
                    project.owner = new ObjectId(adminId);
                    return this.projectService.updateToAdminOwnership(project._id.toString(), project).pipe(
                        catchError(error => {
                            console.error('Error updating project:', error);
                            return of(null); // Continue even if an error occurs
                        })
                    );
                });
                // wait for all projects to adopt Admin ownership completion
                return forkJoin(projectUpdates).pipe(
                    switchMap(() => this.userService.deleteUser(id.toString())) // then delete the user
                );
            } else {
                // if there are no projects, directly delete the user
                return this.userService.deleteUser(id.toString());
            }
        }),
        catchError(err => {
            console.error('Error deleting user:', err);
            this.store.dispatch(userProfileSetErrorMessage({ message: err.error.message }));
            this.store.dispatch(userProfileSetLoading({ isLoading: false }));
            return of(null); // continue the stream
        })
    ).subscribe({
        next: () => {
            this.store.dispatch(userProfileSetLoading({ isLoading: false }));
            this.router.navigate(['/register']);
        },
        error: (err) => {
            console.error('An error occurred:', err);
            this.store.dispatch(userProfileSetLoading({ isLoading: false }));
        }
      });
    }

    togglePasswordVisibility(): void {
      this.isPasswordVisible =!this.isPasswordVisible;
    }
  
    toggleRePasswordVisibility(): void {
      this.isRePasswordVisible =!this.isRePasswordVisible;
    }
}
