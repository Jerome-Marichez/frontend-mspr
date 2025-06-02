export class Login {
    email: string = "";
}

export class result {
    email: string = "";
    password: string = "";
    encryptedPassword: string = "";
    initializationVector: string = "";
    qrPath: string = "";
}

export class LoginResult {
    result: result = new result();
}