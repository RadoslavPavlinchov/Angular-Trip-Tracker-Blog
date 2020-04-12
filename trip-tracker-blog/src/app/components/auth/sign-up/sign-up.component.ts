import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../shared/services/auth.service";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserI } from 'src/app/shared/models/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService, private route: Router) { }

  // signUpForm = new FormGroup({
  //   email: new FormControl('', Validators.required),
  //   password: new FormControl('', Validators.required),
  // })

  // New changes
  public signUpForm = new FormGroup({
    email: new FormControl('',  [Validators.required, Validators.pattern('[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z0-9]+')]),
    secret: new FormControl('',  [Validators.pattern('admin')]),
    password: new FormControl('',  [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('',  [Validators.required]),
  }, this.pwdMatchValidator); 

  ngOnInit() {
  }
 
  // onSignUp(form:UserI) {
  //   this.authService
  //   .signUpWithEmail(form)
  //   .then(res => {
  //     console.log('Successfully', res);
  //     this.route.navigate(['/']);
  //   })
  //   .catch(err => {
  //     console.log('Error', err);
  //   })
  // }

  // New changes
  signup(formData: FormData){
    this.authService.signUp(formData["email"], formData["password"], formData["secret"],);
  }

  pwdMatchValidator(frm: FormGroup) {
    return frm.get('password').value === frm.get('confirmPassword').value ? null : {'mismatch': true};
 }

 get password() { return this.signUpForm.get('password'); }
 get confirmPassword() { return this.signUpForm.get('confirmPassword'); }


}
