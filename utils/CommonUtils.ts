import cryptojs from 'crypto-js';
export default class CommonUtils {
  private secretKey: string;
  constructor() {
    if (process.env.SECRET_KEY) {
      this.secretKey = process.env.SECRET_KEY as string;
    } else {
      throw new Error('SECRET_KEY environment variable is not defined.');
    }
  }

  public encryptData(data: string): string {
    const encryptedData = cryptojs.AES.encrypt(data, this.secretKey).toString();
    console.log(encryptedData);
    return encryptedData;
  }

  public decryptData(encryptedData: string): string {
    console.log(`Secret Key: ${this.secretKey}`);
    const decryptedData = cryptojs.AES.decrypt(encryptedData, this.secretKey).toString(
      cryptojs.enc.Utf8,
    );
    console.log(decryptedData);
    return decryptedData;
  }
}
