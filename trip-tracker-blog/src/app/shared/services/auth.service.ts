import { Injectable, NgZone } from '@angular/core'; 
import { UserI } from "../models/user.interface";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable, BehaviorSubject } from "rxjs"; 
import { FileI } from '../models/file.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore'; 
import { Router } from "@angular/router"; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userData$: Observable<firebase.User>;
  public filePath: string;

  public currentUser: any;
  public userStatus: any;
  public userStatusChanges: BehaviorSubject<string> = new BehaviorSubject<string>(this.userStatus);

  constructor(private afAuth: AngularFireAuth, private storage: AngularFireStorage, private firestore: AngularFirestore, private ngZone: NgZone, private router: Router) {
    this.userData$ = afAuth.authState;
  }

  setUserStatus(userStatus: any): void {
    this.userStatus = userStatus;
    this.userStatusChanges.next(userStatus);
  }

  signUp(email: string, password: string, secret: string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((userResponse) => {
        let user = {
          id: userResponse.user.uid,
          username: userResponse.user.email,
          role: secret,
        }
        this.firestore.collection("users").add(user)
          .then(user => {
            user.get().then(x => {
              this.currentUser = x.data();
              this.setUserStatus(this.currentUser);
              this.router.navigate(["/"]);
            })
          }).catch(err => {
            console.log(err);
          })
      })
      .catch((err) => {
        console.log("An error ocurred: ", err);
      })
  }

  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.firestore.collection("users").ref.where("username", "==", user.user.email).onSnapshot(snap => {
          snap.forEach(userRef => {
            this.currentUser = userRef.data();
            this.setUserStatus(this.currentUser)
            if (userRef.data().role !== "admin") {
              this.router.navigate(["/"]);
            } else {
              this.router.navigate(["/admin"]);
            }
          })
        })
      }).catch(err => err)
  }

  logOut() {
    this.afAuth.auth.signOut()
      .then(() => {
        this.currentUser = null;
        this.setUserStatus(null);
        this.ngZone.run(() => this.router.navigate(["/login"]));

      }).catch((err) => {
        console.log(err);
      })
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

  userChanges() {
    this.afAuth.auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        this.firestore.collection("users").ref.where("username", "==", currentUser.email).onSnapshot(snap => {
          snap.forEach(userRef => {
            this.currentUser = userRef.data();
            this.setUserStatus(this.currentUser);
          })
        })
      } 
    })
  }

}

