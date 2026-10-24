import { hash, verify } from "argon2";
export class Password {
  static async toHash(password: string) {
    const hashedPassword = await hash(password);
    return hashedPassword;
  }
  static async compare(storedHash: string, providedPassword: string) {
    return await verify(storedHash, providedPassword);
  }
}
