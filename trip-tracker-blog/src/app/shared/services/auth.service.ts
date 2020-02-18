import { Injectable, NgZone } from '@angular/core'; // Added ngZone
import { UserI } from "../models/user.interface";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable, BehaviorSubject } from "rxjs"; // Added behavior BehaviorSubject and add it in the constructor
import { FileI } from '../models/file.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore'; // New difference and add it in constructor
import { Router } from "@angular/router"; // Added the router

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userData$: Observable<firebase.User>;
  public filePath: string;

  // New stuff added 
  public currentUser: any;
  public userStatus: any;
  public userStatusChanges: BehaviorSubject<string> = new BehaviorSubject<string>(this.userStatus);

  constructor(private afAuth: AngularFireAuth, private storage: AngularFireStorage, private firestore: AngularFirestore, private ngZone: NgZone, private router: Router) {
    this.userData$ = afAuth.authState;
  }

  // New stuff
  setUserStatus(userStatus: any): void {
    this.userStatus = userStatus;
    this.userStatusChanges.next(userStatus);
  }

  // signUpWithEmail(user: UserI) {
  //   const { email, password } = user;
  //   return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
  //   // .then((res) => {
  //   //   window.alert("You have been successfully registered!");
  //   //   console.log(res.user);
  //   // }).catch((err) => {
  //   //   window.alert(err.message)
  //   // })
  // }

  //New changes
  signUp(email: string, password: string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((userResponse) => {
        // add the user to the "users" database
        let user = {
          id: userResponse.user.uid,
          username: userResponse.user.email,
          role: "user",
        }
        //add the user to the database
        this.firestore.collection("users").add(user)
          .then(user => {
            user.get().then(x => {
              //return the user data
              console.log(x.data());
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

  // loginWithEmail(user: UserI) {
  //   const { email, password } = user;
  //   return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  // }

  // New stuff
  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.firestore.collection("users").ref.where("username", "==", user.user.email).onSnapshot(snap => {
          snap.forEach(userRef => {
            console.log("userRef", userRef.data());
            this.currentUser = userRef.data();
            //setUserStatus
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


  // logout() {
  //   this.afAuth.auth.signOut();
  // }

  // nEW STUFF 
  logOut() {
    this.afAuth.auth.signOut()
      .then(() => {
        console.log("user signed Out successfully");
        //set current user to null to be logged out
        this.currentUser = null;
        //set the listenener to be null, for the UI to react
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


  // New stuff
  userChanges() {
    this.afAuth.auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        this.firestore.collection("users").ref.where("username", "==", currentUser.email).onSnapshot(snap => {
          snap.forEach(userRef => {
            this.currentUser = userRef.data();
            //setUserStatus
            this.setUserStatus(this.currentUser);
            console.log(this.userStatus)

            // if (userRef.data().role !== "admin") {
            //   this.ngZone.run(() => this.router.navigate(["/"]));
            // } else {
            //   this.ngZone.run(() => this.router.navigate(["/"]));
            // }
          })
        })
      } 
      // else {
      //   //this is the error you where looking at the video that I wasn't able to fix
      //   //the function is running on refresh so its checking if the user is logged in or not
      //   //hence the redirect to the login
      //   this.ngZone.run(() => this.router.navigate(["/admin"]));
      // }
    })
  }

}

