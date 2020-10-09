import {
  RouteRequest,
  RouteResponse,
  RouteNext,
  RoutingHandler,
} from '@sheetbase/server';

import {AuthService} from '../services/auth.service';

export class UserMiddleware {
  constructor(private authService: AuthService) {}

  use(): RoutingHandler {
    return (req: RouteRequest, res: RouteResponse, next: RouteNext) => {
      const idToken = (req.query['idToken'] || req.body['idToken']) as string;
      if (idToken) {
        const user = this.authService.getUserByIdToken(idToken);
        if (user) {
          return next({user});
        }
      }
      return res.error('auth/invalid-token');
    };
  }
}
