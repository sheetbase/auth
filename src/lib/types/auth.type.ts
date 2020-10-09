import {User} from '@sheetbase/models';

export interface Options {
  encryptionSecret: string;
  oobUrl?: string | OobUrl;
  oobSubject?: OobSubject;
  oobBody?: OobBody;
}

export type OobUrl = (
  mode: string,
  oobCode: string,
  defaultUrl: string
) => string;
export type OobSubject = (mode: string) => string;
export type OobBody = (mode: string, url: string, user: User) => string;

export interface AuthData {
  uid: string;
  sub: string; // email
  tty: 'ID';
  [claim: string]: unknown;
}

export interface AuthPayload extends AuthData {
  iss: 'https://sheetbase.app';
  aud: 'https://sheetbase.app';
  iat: number;
  exp: number;
}

export interface OauthUserInfo {
  id?: string;
  email?: string;
  name?: string;
  picture?: unknown;
  [key: string]: unknown;
}

export interface GoogleUserInfo extends OauthUserInfo {
  link?: string;
}

export type FacebookUserInfo = OauthUserInfo;
