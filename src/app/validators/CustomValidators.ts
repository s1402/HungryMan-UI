import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static emailValidator(control: AbstractControl): ValidationErrors | null {
    let email: string = control.value;
    const validEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !validEmailRegex.test(email)) {
      return { email: true };
    }
    return null;
  }

  static passwordValidator(control: AbstractControl): ValidationErrors | null {
    let password: string = control.value;
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (password && !passwordRegex.test(password)) {
      return { password: true };
    }
    return null;
  }
}
