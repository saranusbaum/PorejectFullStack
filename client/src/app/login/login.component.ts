import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'] 

})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
   this.loginForm = this.fb.group({
  name: [''],  // הוסיפי את זה!
  email: [''],
  password: ['']
});

  }

  login() {
    debugger
    this.http.post<any>('http://localhost:3000/api/auth/login', this.loginForm.value)
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('userName', res.name);
          this.router.navigate(['/chat']);
        },
        error: () => alert('שגיאה בהתחברות')
      });
  }
  handleLoginOrRegister() {
  const { email } = this.loginForm.value;

  // בדיקה האם המשתמש קיים
  this.http.get<any>(`http://localhost:3000/api/auth/check-user?email=${email}`).subscribe({
    next: (res) => {
      if (res.exists) {
        // משתמש קיים - מבצע התחברות
        this.login();
      } else {
        // משתמש חדש - קודם נרשם ואז מתחבר
        this.registerAndLogin();
      }
    },
    error: () => alert('שגיאה בבדיקת משתמש')
  });
}



registerAndLogin() {
  this.http.post<any>('http://localhost:3000/api/auth/register', this.loginForm.value).subscribe({
    next: () => {
      this.login(); // אחרי הרשמה – מתחבר
    },
    error: () => alert('שגיאה בהרשמה')
  });
}

//   register() {
//     debugger
//     console.log(this.loginForm.value)
//   this.http.post<any>('http://localhost:3000/api/auth/register', this.loginForm.value)
//     .subscribe({
//       next: (res) => alert('נרשמת בהצלחה!'),
//       error: () => alert('שגיאה בהרשמה')
//     });
// }
}