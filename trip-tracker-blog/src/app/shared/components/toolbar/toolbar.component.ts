import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  public appName = 'Trip Tracker'

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  onLogout(): void {
    this.authService.logout();
  }
}
