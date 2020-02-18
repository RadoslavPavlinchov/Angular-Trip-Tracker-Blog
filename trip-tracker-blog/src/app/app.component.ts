import { Component } from '@angular/core';
// import { AuthService } from "./shared/services/auth.service"; // Added additionaly

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'trip-tracker-blog';

  // // New stuff added 
  // constructor(private firebaseService: AuthService){}

  // userStatus = this.firebaseService.userStatus;

  // // Transferred to the toolbar
  // // logout(){
  // //   this.firebaseService.logOut();
  // // }


  // ngOnInit(){
  //   this.firebaseService.userChanges();

  //   this.firebaseService.userStatusChanges.subscribe(x => this.userStatus = x);
  //   console.log(this.userStatus)
  // }
}
