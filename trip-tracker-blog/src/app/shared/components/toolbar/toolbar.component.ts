import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  public appName = 'Trip Tracker Blog'

  constructor(public authService: AuthService) { }
  // new stuff
  userStatus = this.authService.userStatus;

  // ngOnInit() {
  // }

  // New stuff
  ngOnInit(){
    this.authService.userChanges();

    this.authService.userStatusChanges.subscribe(x => this.userStatus = x);
    console.log(this.userStatus)
  }

  // onLogout(): void {
  //   this.authService.logout();
  // }

  // New stuff
  logout(){
    this.authService.logOut();
    
  }
}
