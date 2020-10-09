import {
  RouteRequest,
  RouteResponse,
  RouteNext,
  RoutingHandler,
} from '@sheetbase/server';

import {TokenService} from '../services/token.service';

export class IdTokenMiddleware {
  constructor(private tokenService: TokenService) {}

  use(): RoutingHandler {
    return (req: RouteRequest, res: RouteResponse, next: RouteNext) => {
      const idToken = (req.query['idToken'] || req.body['idToken']) as string;
      if (idToken) {
        const auth = this.tokenService.decodeIdToken(idToken);
        if (auth) {
          return next({auth});
        }
      }
      return res.error('auth/invalid-token');
    };
  }
}
