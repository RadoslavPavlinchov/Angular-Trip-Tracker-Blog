import { Injectable } from '@angular/core';
import { UserI } from "../models/user.interface";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from "rxjs";
import { FileI } from '../models/file.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userData$: Observable<firebase.User>;
  public filePath: string;

  constructor(private afAuth: AngularFireAuth, private storage: AngularFireStorage) {
    this.userData$ = afAuth.authState;
  }

  signUpWithEmail(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then((res) => {
      window.alert("You have been successfully registered!");
      console.log(res.user);
    }).catch((err) => {
      window.alert(err.message)
    })
  }

  loginWithEmail(user: UserI) {
    const { email, password } = user;
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  preSaveUserProfile(user: UserI, image?: FileI): void {
    if (image) {
      this.uploadImage(user, image);
    } else {
      this.saveUserProfile(user);
    }
  }

  private uploadImage(user: UserI, image: FileI): void {
    this.filePath = `images/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(urlImage => {
            user.photoURL = urlImage;
            this.saveUserProfile(user);
          });
        })
      ).subscribe();
  }

  private saveUserProfile(user: UserI) {
    this.afAuth.auth.currentUser.updateProfile({
      displayName: user.displayName,
      photoURL: user.photoURL
    })
      .then(() => console.log('User updated'))
      .catch((err) => console.log('Error', err));
  }
}
