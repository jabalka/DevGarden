



## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.



# DevGarden

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
  - [API Endpoints](#api-endpoints)
    - [Projects](#projects)
    - [Users](#users)
- [Middleware](#middleware)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Introduction

DevPlace Front-End is a web application built with Angular, designed to provide a platform for users to share, manage, and interact with their projects. Users can create, edit, delete, and preview projects, as well as manage their profiles and profile pictures. The application includes features such as pagination and local storage for user session management.
To full-stack the app you can go to the back-end side on [here](https://github.com/jabalka/DevPlace).
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.10.

## Features

- Project Management: Users can create, edit, delete, and preview projects.
- User Profiles: Users can update their profile information and upload or delete profile pictures.
- Pagination: Efficiently handle large sets of data with pagination.
- Local Storage: Uses local storage to save and manage user information.
- Angular Material: Utilizes Angular Material for a modern and responsive UI.

## Technologies Used
### Client Side
This application is built using the following technologies:
- Angular 17: A platform and framework for building client-side applications using HTML, CSS, and JavaScript/TypeScript.
- Angular Material: Provides a set of reusable UI components based on Material Design.
- NgRx: A set of libraries for reactive state management in Angular.

### Dependencies
The application depends on the following packages:
  ```bash
       "dependencies": {
          "@angular/animations": "^17.0.0",
          "@angular/common": "^17.0.0",
          "@angular/compiler": "^17.0.0",
          "@angular/core": "^17.0.0",
          "@angular/forms": "^17.0.0",
          "@angular/material": "^17.3.10",
          "@angular/platform-browser": "^17.0.0",
          "@angular/platform-browser-dynamic": "^17.0.0",
          "@angular/platform-server": "^17.3.11",
          "@angular/router": "^17.0.0",
          "@angular/ssr": "^18.0.3",
          "@ngrx/effects": "^18.0.0",
          "@ngrx/store": "^17.1.1",
          "@ngrx/store-devtools": "^17.1.1",
          "bson": "^4.6.4",
          "rxjs": "^7.8.0",
          "swiper": "^11.1.10",
          "tslib": "^2.3.0",
          "zone.js": "~0.14.2"
      }
  ```  
  
## Installation
To get started with the DevPlace Front-End application, follow these steps:

1. **Clone the repository:**
     ```bash
     git clone https://github.com/jabalka/DevPlace.git
     cd devplace
     ```
2. **Install dependencies:**
     ```bash
     cd [C:\User]\DevPlace
     ``` 
    *replace [C:\User] with your actual directory
3. **Install dependencies:**
     ```bash
     npm install
     ```  
4. **Serve the Application**
     ```bash
     ng s
     ```  
  The application will be available at http://localhost:4200.

## Usage
  Once the application is running, you can access the following functionalities:
  ### Users
  ```bash
      const apiUrl = 'http://localhost:3000/' + 'user/'; 
  ```
  + Create a User Profile: Register a new user profile thus will be saved on the server side.
    ```bash
         function register(data: any): Observable<any> {
            return this.http.post<UserModel>(apiUrl + 'register', data, {withCredentials: true}).pipe(
              tap((user: UserModel) => {
                this.store.dispatch(register({ user}));
              })
            );
         };
    ```
  + Login: Login to an existing profile.
    ```bash
         function login(data: any): Observable<any> {
            return this.http.post<UserModel>(apiUrl + 'login', data, {withCredentials: true}).pipe(
              tap((user: UserModel) => {
                this.store.dispatch(login({user}));
              })
            );
         };
    ```  
  + Logout: Logout from profile and use the platform as a guest.
    ```bash
          function logout(): Observable<any> {
            return this.http.get(apiUrl + 'logout', {withCredentials: true}).pipe(
              tap(() => {
                this.store.dispatch(logout());
                this.navigationService.clearHistory();
              })
            );
          };
    ``` 
  + Manage Profile: Update your profile information and upload or delete profile pictures.
    ```bash
          function updateProfile(data:any, file: File | null): Observable<any>{
            const formData = new FormData();
            for(const key in data){
              if(data.hasOwnProperty(key)) {
                formData.append(key, data[key]);
              }
            }
            if(file){
              formData.append('profilePicture', file);
            }
            return this.http.put<any>(apiUrl + 'profile', formData, {headers: this.createHeaders(), withCredentials: true}).pipe(
              tap((user: any) => {
                this.store.dispatch(updateUser({user}));
                const newProfilePicUrl = `${environment.apiUrl}uploads/profilePics/${user.profilePicture}`;
                this.profilePicChangeSubject.next(newProfilePicUrl);
              })
            );
          };
    ```
  + Delete Profile: User profile can be deleted if password verification has passed.
    *Password Verification*
    ```bash
      function verifyPass(data: any): Observable<any> {
          return this.http.post(apiUrl + 'user/verify', data);
      };
    ```
    *Profile Delete*
    ```bash
       function deleteUser(userId: string): Observable<any> {
            return this.http.delete<any>(apiUrl + 'profile/' + userId, {headers: this.createHeaders(), withCredentials: true}).pipe(
              tap(() => {
                this.store.dispatch(clearUserData());
              })
            );
      };
    ```
  ### Projects
  ```bash
      const apiUrl = 'http://localhost:3000/' + 'projects/';  
  ```
  + Create Project: Use the project management interface to create project.
    ```bash
        function createProject(project: Project): Observable<Project> {
            const headers = this.createHeaders();
            return this.http.post<Project>(apiUrl, project, {headers: this.createHeaders(), withCredentials: true});
        };
    ```
  + Edit Project: Use the project management interface to modify project.
    ```bash
        function updateProject(projectId: string, project: Project): Observable<Project> {
            return this.http.put<Project>(apiUrl + projectId, project, {headers: this.createHeaders(), withCredentials: true});
        };
    ```
  + Delete Projects: Use the project management interface to modify or remove projects.
    ```bash
        function deleteProject(id: string): Observable<void> {
            return this.http.delete<void>(apiUrl + id, {headers: this.createHeaders(), withCredentials: true});
        };
    ```
    + View Projects: Browse through projects with pagination.
    ```bash
        function getProjects(page: number, pageSize: number): Observable<ProjectResponse> {
            const url = `${apiUrl}?page=${page}&pageSize=${pageSize}`;
            return this.http.get<ProjectResponse>(url);
        }
    ```
    + View Own Projects: Browse through your own projects with pagination.
    ```bash
        function getOwnerProjects(ownerId: string, page: number, pageSize: number): Observable<ProjectResponse> {
            const url = `${apiUrl}?_ownerId=${ownerId}&page=${page}&pageSize=${pageSize}`;
            return this.http.get<ProjectResponse>(url, {headers: this.createHeaders(), withCredentials: true});
        };
    ```
    + Other UI functionalities throughout the application.

## Configuration
Configuration settings are stored in the config directory. Ensure you set the appropriate environment variables in your .env file.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
