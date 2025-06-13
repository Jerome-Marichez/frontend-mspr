export interface RegisterResult {
  email: string;
  encryptedPassword: string;
  iv: string;
  password : string;
  createdAt: number;
  expired: boolean;
  qrCode?: string; // Data URI base64 du QR code (pour la password)
  qrPath?: string; // (optionnel, pour le QR code stocké côté 2FA uniquement)
}
