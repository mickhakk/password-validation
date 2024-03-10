import { Component } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from "rxjs";

export enum EPasswordStrengthStatuses {
  NONE ,
  EASY,
  MEDIUM,
  STRONG
}

const PASSWORD_STRENGTH_BY_INDEX = [
  EPasswordStrengthStatuses.NONE,
  EPasswordStrengthStatuses.EASY,
  EPasswordStrengthStatuses.MEDIUM,
  EPasswordStrengthStatuses.STRONG,
];

const ONLY_LETTERS_REGEX = /[a-zA-Z]/;
const ONLY_DIGITS_REGEX = /\d/;
const ONLY_SYMBOLS_REGEX = /[^a-zA-Z0-9]/;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  passwordFormControl = new FormControl('', Validators.minLength(8));
  passwordStrengthStatus = EPasswordStrengthStatuses.NONE;
  passwordStrengthStatuses = EPasswordStrengthStatuses;

  constructor() {
    this.passwordFormControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((password) => {
        if (!password || this.isPasswordInvalid) {
          this.passwordStrengthStatus = EPasswordStrengthStatuses.NONE;
          return;
        }

        let strengthStatusCounter = 0;
        if (ONLY_LETTERS_REGEX.test(password)) {
          strengthStatusCounter++;
        }
        if (ONLY_DIGITS_REGEX.test(password)) {
          strengthStatusCounter++;
        }
        if (ONLY_SYMBOLS_REGEX.test(password)) {
          strengthStatusCounter++;
        }

        this.passwordStrengthStatus = PASSWORD_STRENGTH_BY_INDEX[strengthStatusCounter];
    });
  }

  get isPasswordInvalid(): boolean {
    return this.passwordFormControl.invalid;
  }
}
