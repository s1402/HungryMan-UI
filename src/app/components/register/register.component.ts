import { SharedService } from './../../services/shared.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomError } from 'src/app/common/enums/CustomError';
import { User } from 'src/app/common/interfaces/User';
import { RegisterService } from 'src/app/services/register.service';
import { CustomValidators } from 'src/app/validators/CustomValidators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup = this.fb.group({});
  isOwner = false;
  showSnackBar = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: RegisterService,
    private readonly sharedService: SharedService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: ['', [Validators.required, CustomValidators.emailValidator]],
      password: ['', [Validators.required, CustomValidators.passwordValidator]],
      restaurantName: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        pincode: [''],
        country: ['India'],
      }),
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    const ownerSpecificFields = [
      this.restaurantName,
      this.street,
      this.city,
      this.state,
      this.pincode,
      this.country,
      this.restaurantName,
    ];
    if (this.isOwner) {
      // dynamically add the validators for Onwer specific form fields: restaurantName & address
      for (let formControl of ownerSpecificFields) {
        formControl?.setValidators([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ]);
        formControl?.updateValueAndValidity();
      }
    } else {
      // dynamically reset validators for Onwer specific form fields: restaurantName & address
      for (let formControl of ownerSpecificFields) {
        formControl?.clearValidators();
        formControl?.reset();
        formControl?.updateValueAndValidity();
      }
    }

    if (this.form.invalid) {
      return;
    }
    const payload: User = this.isOwner
      ? this.form.value
      : {
          name: this.name?.value,
          email: this.email?.value,
          password: this.password?.value,
        };
    this.service.register(payload, this.isOwner).subscribe({
      next: (response) => {
        if (response) {
          this.showSnackBar = true;
          this.sharedService.showSnackBar({
            isSuccess: true,
            text: 'User Regsitered Successfully',
          });
          setTimeout(() => {
            this.showSnackBar = false;
            this.router.navigate(["/login"]);
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

  get name() {
    return this.form.get('name');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get restaurantName() {
    return this.form.get('restaurantName');
  }

  get street() {
    return this.form.get('address.street');
  }

  get city() {
    return this.form.get('address.city');
  }

  get state() {
    return this.form.get('address.state');
  }

  get pincode() {
    return this.form.get('address.pincode');
  }

  get country() {
    return this.form.get('address.country');
  }
}
