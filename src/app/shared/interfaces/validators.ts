import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailValidator(control: AbstractControl): ValidationErrors | null{
    const value = (control.value as string);
    if(!value) { return null;}
    const isValidEmail =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test((control.value as string));
    return isValidEmail ? null : { emailValidator: true};
}

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) { return null; }

    const errors: ValidationErrors = {};
    const isValidLength = value.trim().length >= 8;
    const hasNumber = /[0-9]/.test(value.trim());
    const hasSpecialChar = /[!@#$%^&*()_+]/.test(value.trim());

    if (!isValidLength) {
        errors['minLength'] = 'Password must be at least 8 characters long';
    }
    if (!hasNumber) {
        errors['hasNumber'] = 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
        errors['hasSpecialChar'] = 'Password must contain at least one special character: e.g. (!@#$%^&*()_+)';
    }

    return Object.keys(errors).length > 0 ? errors : null;
}

export function rePasswordValidatorFactory(targetControl: AbstractControl): ValidatorFn {
    return function rePasswordValidator(control: AbstractControl): ValidationErrors | null {
        const areTheSame = targetControl.value === control.value;
        return areTheSame ? null : { areTheSame: 'Passwords do not match!' };
    }
}