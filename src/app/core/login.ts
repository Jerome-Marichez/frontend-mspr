export class Login {
    email: string = "";
}

export class LoginResult {
    email: string = "";
    password: string = "";
    encryptedPassword: string = "";
    initializationVector: string = "";
    qrPath: string = "";
}