export class Login {
    email: string = "";
}

export class result {
    createdAt: string = '';
    email: string = "";
    password: string = "";
    encryptedPassword: string = "";
    expired: boolean = false;
    initializationVector: string = "";
    qrPath: string = "";
}

export class LoginResult {
    result: result = new result();
}

export class Connexion {
    password: string = "";
    twofa: string = "";
    email?: string = "";
}

export class Gen2fa {
    twofa: string = '';
    initializationVector: string = '';
    qrPath: string = "";
}