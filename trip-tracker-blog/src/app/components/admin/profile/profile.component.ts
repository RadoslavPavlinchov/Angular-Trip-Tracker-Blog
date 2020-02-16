import { FileI } from "./../../../shared/models/file.interface";
import { UserI } from "./../../../shared/models/user.interface";
import { AuthService } from "./../../../shared/services/auth.service";
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public image: FileI;
  public currentImage: string = 'https://picsum.photos/seed/picsum/150/150';

  constructor(private authService: AuthService) { }

  public profileForm = new FormGroup({
    displayName: new FormControl('', Validators.required),
    email: new FormControl({ value: '', disabled: true }, Validators.required),
    photoURL: new FormControl('', Validators.required)
  });

  ngOnInit() {
    this.authService.userData$.subscribe(user => {
      this.initValuesForm(user);
    })
  }

  onSaveUser(user: UserI): void {
    this.authService.preSaveUserProfile(user, this.image);
  }

  private initValuesForm(user: UserI): void {
    if (user.photoURL) {
      this.currentImage = user.photoURL;
    }

    this.profileForm.patchValue({
      displayName: user.displayName,
      email: user.email,

    })
  }

  imageHandler(image:FileI): void {
    this.image = image;
  }
}
