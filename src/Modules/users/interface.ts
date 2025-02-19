export interface JwtPayloadInterface {
  sub: string;
  username: string;
  iat: number;
  exp: number;
}
