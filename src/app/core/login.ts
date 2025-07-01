export class Login {
  email: string = '';
}

export class result {
  createdAt: string = '';
  email: string = '';
  password: string = '';
  encryptedPassword: string = '';
  expired: boolean = false;
  initializationVector: string = '';
  qrPath: string = '';
  qrCode: string = ''; // Ajout de la propriété qrCode renvoyée par le backend
}

export class LoginResult {
  status: string = '';
  result: {
    success: boolean;
    expired: boolean;
    message: string;
    reason?: string;
  } = {
    success: false,
    expired: false,
    message: ''
  };
}

export class Connexion {
  email: string = '';
  password: string = '';
  code2FA: string = ''; //OTP
}

export class Gen2fa {
  result: Result2fa = new Result2fa();
}

export class Result2fa {
  createdAt: string = '';
  email: string = '';
  encrypted2FASecret: string = '';
  expired: boolean = false;
  iv: string = '';
  otpAuthUrl: string = '';
  qrPath: string = '';
  qrCode: string = ''; // Ajout de la propriété qrCode renvoyée par le backend
}
