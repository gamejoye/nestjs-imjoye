import * as jwt from 'jsonwebtoken';

export function mockJwt(userId: number, secret: string) {
  return jwt.sign({ id: userId }, secret, { expiresIn: '1h' });
}
