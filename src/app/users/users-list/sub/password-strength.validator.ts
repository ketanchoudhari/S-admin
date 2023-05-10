import { AbstractControl, ValidationErrors } from '@angular/forms';

export const PasswordStrengthValidator = function (
  control: AbstractControl
): ValidationErrors | null {
  let value: string = control.value || '';
  let msg = '';
  if (!value) {
    return null;
  }

  let upperCaseCharacters = /[A-Z]+/g;

  if (upperCaseCharacters.test(value) === false) {
    return {
      passwordStrength: 'Password must contain at least one uppercase letter.',
    };
  }
};

export const StrongPasswordValidator = function (
  control: AbstractControl
): ValidationErrors | null {
  let value: string = control.value || '';
  let msg = '';
  if (!value) {
    return null;
  }

  // let upperCaseCharacters = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
  let specialchar = /(?=.*[!@#$%^&*])/;
  let digit = /(?=\D*\d)/
  let lowercase = /(?=[^a-z]*[a-z])/;
  let uppercase = /(?=[^A-Z]*[A-Z])/;
  let charstring = /.{8,}/;

  if (uppercase.test(value) === false) {
    return {
      passwordStrength: 'Password must be at least 1 upper case letters.',
    };
  }else if(digit.test(value) === false) {
    return {
      passwordStrength: 'Password must be at least 1 number.',
    };
  }else if(lowercase.test(value) === false) {
    return {
      passwordStrength: 'Password must be at least 1 lower case letters.',
    };
  }else if(specialchar.test(value) === false) {
    return {
      passwordStrength: 'Password must be at least 1 letter special character.',
    };
  }else if(charstring.test(value) === false) {
    return {
      passwordStrength: 'Password must be at least 8 character long.',
    };
  }
};
