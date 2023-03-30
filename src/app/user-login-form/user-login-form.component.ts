import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRegistrationService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})

export class UserLoginFormComponent {
  @Input() userData = { Username: '', Password: ''};

constructor(
  public fetchApiData: UserRegistrationService,
  public dialogRef: MatDialogRef<UserLoginFormComponent>,
  public snackBar: MatSnackBar) { }



login(): void {
  this.fetchApiData.userLogin(this.userData).subscribe((response) => {
    console.log(response);
    //adicionado para salvar no localstorage (conferir se response é ok)
    // localStorage.setItem('user', response.user.Username);
    // localStorage.setItem('token', response.token);

    this.dialogRef.close(); // This will close the modal on success!
    this.snackBar.open('deu certo', 'OK', {
       duration: 2000
    });
   }, (response) => {
     this.snackBar.open(response, 'OK', {
       duration: 2000
     });
   });
 }

}
