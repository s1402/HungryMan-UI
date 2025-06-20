import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomError } from 'src/app/common/enums/CustomError';
import { User } from 'src/app/common/interfaces/User';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { CustomValidators } from 'src/app/validators/CustomValidators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup = this.fb.group({});
  isOwner = false;
  showSnackBar = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: AuthService,
    private readonly sharedService: SharedService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, CustomValidators.emailValidator]],
      password: ['', [Validators.required, CustomValidators.passwordValidator]]
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const payload: User = this.form.value;

    this.service.login(payload, this.isOwner).subscribe({
      next: (response) => {
        if (response) {
          this.showSnackBar = true;
          this.sharedService.showSnackBar({
            isSuccess: true,
            text: 'User Logged in Successfully!',
          });
          setTimeout(() => {
            this.showSnackBar = false;

          }, 3000);
        }
      },
      error: (response) => {
        this.showSnackBar = true;
        if (response && response.error && response.error['error']) {
          this.form.setErrors(response.error['error']);
          this.sharedService.showSnackBar({
            isSuccess: false,
            text: response.error['error'],
          });
        } else {
          this.form.setErrors({ error: CustomError.SERVER_IS_DOWN });
          this.sharedService.showSnackBar({
            isSuccess: false,
            text: CustomError.SERVER_IS_DOWN,
          });
        }
        setTimeout(() => {
          this.showSnackBar = false;
        }, 3000);
      },
    });
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}