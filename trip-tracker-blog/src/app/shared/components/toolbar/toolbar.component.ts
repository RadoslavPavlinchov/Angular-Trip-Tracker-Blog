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
  userStatus = this.authService.userStatus;

  ngOnInit(){
    this.authService.userChanges();
    this.authService.userStatusChanges.subscribe(x => this.userStatus = x);
  }

  logout(){
    this.authService.logOut();
    
  }
}
