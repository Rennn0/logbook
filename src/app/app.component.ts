import { Component, OnInit } from '@angular/core';
import { GoogleSigninService } from './core/services/google-auth/google-signin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Germania - Frankfurter Rudergesellschaft';

  constructor(private googleSigninService: GoogleSigninService) { }

  ngOnInit(): void {
    //initialize google Accounts flow - test build
    this.googleSigninService.initGoogleAccounts();
    console.log('terminal-v - 0.0.21.3');
  }
}
