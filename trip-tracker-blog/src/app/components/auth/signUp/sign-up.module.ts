import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SignupRoutingModule } from './sign-up-routing.module';
import { SignupComponent } from './sign-up.component';
import { MaterialModule } from "../../../material.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule,
    SignupRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class SignupModule { }