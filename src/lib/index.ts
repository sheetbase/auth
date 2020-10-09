import {
  ServerModule,
  DisabledRoutes,
  Middlewares,
  RouteMiddlewares,
} from '@sheetbase/server';
import {DatabaseModule} from '@sheetbase/database';
import {MailModule} from '@sheetbase/mail';

import {Options} from './types/auth.type';

import {OptionService} from './services/option.service';
import {HelperService} from './services/helper.service';
import {TokenService} from './services/token.service';
import {OobService} from './services/oob.service';
import {OauthService} from './services/oauth.service';
import {AuthService} from './services/auth.service';

import {UserMiddleware} from './middlewares/user.middleware';
import {IdTokenMiddleware} from './middlewares/id-token.middleware';

import {AuthRoute} from './routes/auth.route';
import {AuthPublicRoute} from './routes/auth-public.route';
import {AuthUserRoute} from './routes/auth-user.route';
import {AuthTokenRoute} from './routes/auth-token.route';
import {AuthOobRoute} from './routes/auth-oob.route';
import {AuthActionRoute} from './routes/auth-action.route';
import {AuthOauthRoute} from './routes/auth-oauth.route';

export class Lib {
  optionService: OptionService;
  helperService: HelperService;
  tokenService: TokenService;
  oobService: OobService;
  oauthService: OauthService;
  authService: AuthService;
  userMiddleware: UserMiddleware;
  idTokenMiddleware: IdTokenMiddleware;
  authRoute: AuthRoute;
  authPublicRoute: AuthPublicRoute;
  authUserRoute: AuthUserRoute;
  authTokenRoute: AuthTokenRoute;
  authOobRoute: AuthOobRoute;
  authActionRoute: AuthActionRoute;
  authOauthRoute: AuthOauthRoute;

  constructor(
    private serverModule: ServerModule,
    private databaseModule: DatabaseModule,
    private mailModule: MailModule,
    options: Options
  ) {
    // services
    this.optionService = new OptionService(options);
    this.helperService = new HelperService();
    this.tokenService = new TokenService(
      this.optionService,
      this.helperService
    );
    this.oobService = new OobService(
      this.mailModule.mailService,
      this.optionService
    );
    this.oauthService = new OauthService();
    this.authService = new AuthService(
      this.databaseModule.databaseService,
      this.helperService,
      this.tokenService,
      this.oauthService
    );
    // middlewares
    this.userMiddleware = new UserMiddleware(this.authService);
    this.idTokenMiddleware = new IdTokenMiddleware(this.tokenService);
    // routes
    this.authRoute = new AuthRoute(this.helperService, this.authService);
    this.authPublicRoute = new AuthPublicRoute(this.authService);
    this.authUserRoute = new AuthUserRoute(this.authService);
    this.authTokenRoute = new AuthTokenRoute(this.authService);
    this.authOobRoute = new AuthOobRoute(this.oobService, this.authService);
    this.authActionRoute = new AuthActionRoute(
      this.helperService,
      this.oobService,
      this.authService
    );
    this.authOauthRoute = new AuthOauthRoute(this.authService);
  }

  /**
   * Expose the module routes
   */
  registerRoutes(
    routeEnabling?: true | DisabledRoutes,
    middlewares?: Middlewares | RouteMiddlewares
  ) {
    return this.serverModule.routerService.register(
      [
        this.authRoute,
        this.authPublicRoute,
        this.authUserRoute,
        this.authTokenRoute,
        this.authOobRoute,
        this.authActionRoute,
        this.authOauthRoute,
      ],
      routeEnabling,
      middlewares
    );
  }

  useUserMiddleware() {
    return this.userMiddleware.use();
  }

  userIdTokenMiddleware() {
    return this.idTokenMiddleware.use();
  }
}
