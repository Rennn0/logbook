import { Component, OnInit } from '@angular/core';
import { GoogleSigninService } from 'src/app/core/services/google-auth/google-signin.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  // subscription: Subscription = new Subscription();

  // client: any

  constructor(private googleSigninService: GoogleSigninService) { }

  ngOnInit(): void {
    // this.client = google.accounts.oauth2.initTokenClient({
    //   client_id:
    //     '541247734652-sd07kqiphuij2jul6lbh8kuqnq9f2d8f.apps.googleusercontent.com',
    //   scope: 'openid email profile',
    //   callback: (response: any) => {
    //     console.log(response, response.access_token, response.id_token, '--------------------');
    //     this.subscription.add(this.dataService.getDefData('https://openidconnect.googleapis.com/v1/userinfo', response.access_token).subscribe(Response => {
    //       console.log(Response)
    //     }, error => {
    //       console.log(error)
    //     }))

    //     // var xhr = new XMLHttpRequest();
    //     // xhr.addEventListener('load', (e) => {
    //     //   console.log(xhr.response, '---------------------');
    //     // });
    //     // xhr.addEventListener('error', (err) => {
    //     //   console.error('error from request', err);
    //     // });
    //     // xhr.open('GET', 'https://openidconnect.googleapis.com/v1/userinfo');
    //     // xhr.setRequestHeader('Authorization', 'Bearer ' + response.access_token);
    //     // xhr.send();
    //   },
    // });
  }



  // testRenderButton(): void {
  //   let container = document.getElementById('buttonContianer') as HTMLElement;
  //   google.accounts.id.renderButton(container, { type: 'standard' });
  // }

  // getAuthCode() {
  //   // Request authorization code and obtain user consent
  //   this.client.requestCode();
  // }

  // checkAuthentication(): void {
  //   this.googleSigninService.checkIfUserAuthenticated().then((user?) => {
  //     if (user) {
  //       this._router.navigate(['/home']);
  //     }
  //   });
  // }

  // getToken() {
  //   console.log(this.client);
  //   this.client.requestAccessToken();
  // }

  // revokeToken(): void {
  //   // this.client.CodeClient.requestCode();
  //   // this.client.revoke('ya29.a0AeTM1ifbi8g47BEPNC5hIONmbLRm71jntPVjHPBvXg3xwfdbvdGvlRxZld50DLI01_TOERDzUgbfoijq-US9ygxbAKJFN-1sig5f6TN7IzHZ1GWeFSRnIjDbTcqj4IicVyJ3rpBp50P0F78Jfelo27BmiSmBaCgYKAeYSARESFQHWtWOmTUrXE_Py9OAmRvvxYxr4ig0163')
  // }

  signIn() {
    this.googleSigninService.authenticate();
    console.log('googleSigninService.authenticate() invoke');
    // google.accounts.id.prompt();
    // this.googleSigninService.signIn().then((user?: gapi.auth2.CurrentUser) => {
    //   console.log(user, 'SigninComponent')
    //   if (user) {
    //     this._router.navigate(['/home']);
    //   }
    // }).catch(error => {
    //   console.log(error, 'SigninComponent')
    // })
  }

  // singout(): void {
  //   console.log('singout google.accounts.id.disableAutoSelect');
  //   google.accounts.id.disableAutoSelect();
  // }
}
