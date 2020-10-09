import {KJUR} from 'jsrsasign-jwths';

import {AuthData} from '../types/auth.type';

export class HelperService {
  constructor() {}

  sha256(input: string) {
    return KJUR.crypto.Util.sha256(input);
  }

  signJWT(data: AuthData, secret: string) {
    return KJUR.jws.JWS.sign(
      'HS256',
      JSON.stringify({alg: 'HS256', typ: 'JWT'}),
      JSON.stringify({
        ...data,
        iss: 'https://sheetbase.app',
        aud: 'https://sheetbase.app',
        iat: KJUR.jws.IntDate.get('now'),
        exp: KJUR.jws.IntDate.get('now + 1hour'),
      }),
      {utf8: secret}
    );
  }

  parseJWT(token: string) {
    return KJUR.jws.JWS.parse(token);
  }

  verifyJWT(token: string, secret: string) {
    return KJUR.jws.JWS.verifyJWT(
      token,
      {utf8: secret},
      {
        alg: ['HS256'],
        iss: ['https://sheetbase.app'],
        aud: ['https://sheetbase.app'],
      }
    );
  }

  isValidEmail(email: string) {
    // tslint:disable-next-line:max-line-length
    return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
      email
    );
  }

  uniqueId(length = 12, startWith = '-'): string {
    const maxLoop = length - 8;
    const ASCII_CHARS =
      startWith +
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
    let lastPushTime = 0;
    const lastRandChars = [];
    let now = new Date().getTime();
    const duplicateTime = now === lastPushTime;
    lastPushTime = now;
    const timeStampChars = new Array(8);
    let i;
    for (i = 7; i >= 0; i--) {
      timeStampChars[i] = ASCII_CHARS.charAt(now % 64);
      now = Math.floor(now / 64);
    }
    let uid = timeStampChars.join('');
    if (!duplicateTime) {
      for (i = 0; i < maxLoop; i++) {
        lastRandChars[i] = Math.floor(Math.random() * 64);
      }
    } else {
      for (i = maxLoop - 1; i >= 0 && lastRandChars[i] === 63; i--) {
        lastRandChars[i] = 0;
      }
      lastRandChars[i]++;
    }
    for (i = 0; i < maxLoop; i++) {
      uid += ASCII_CHARS.charAt(lastRandChars[i]);
    }
    return uid;
  }

  htmlPage(body: string) {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Sheetbase</title>
  
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
          }
          .wrapper {
            width: 500px;
            margin: 100px auto;
          }
        </style>
  
      </head>
      <body>
  
        <div class="wrapper">
          ${body}
        <div>
  
      </body>
      </html>`;
  }
}
