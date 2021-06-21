import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/crypto/decrypter'
import { Encrypter } from '../../../data/protocols/crypto/encrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secretOrPrivateKey: string) {}

  async encrypt(value: string): Promise<string> {
    const token = jwt.sign({ id: value }, this.secretOrPrivateKey)
    return token
  }

  async decrypt(ciphertext: string): Promise<string> {
    return jwt.verify(ciphertext, this.secretOrPrivateKey) as any
  }
}
