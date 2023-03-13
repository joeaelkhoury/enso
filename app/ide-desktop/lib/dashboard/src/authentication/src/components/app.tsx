/** @file File containing the {@link App} React component, which is the entrypoint into our React
 * application.
 *
 * # Providers
 *
 * The {@link App} component is responsible for defining the global context used by child
 * components. For example, it defines a {@link toast.Toaster}, which is used to display temporary
 * notifications to the user. These global components are defined at the top of the {@link App} so
 * that they are available to all of the child components.
 *
 * The {@link App} also defines various providers (e.g., {@link authProvider.AuthProvider}).
 * Providers are a React-specific concept that allows components to access global state without
 * having to pass it down through the component tree. For example, the
 * {@link authProvider.AuthProvider} wraps the entire application, and provides the context
 * necessary for child components to use the {@link authProvider.useAuth} hook. The
 * {@link authProvider.useAuth} hook lets child components access the user's authentication session
 * (i.e., email, username, etc.) and it also provides methods for signing the user in, etc.
 *
 * Providers consist of a provider component that wraps the application, a context object defined
 * by the provider component, and a hook that can be used by child components to access the context.
 * All of the providers are initialized here, at the {@link App} component to ensure that they are
 * available to all of the child components.
 *
 * # Routes and Authentication
 *
 * The {@link AppRouter} component defines the layout of the application, in terms of navigation. It
 * consists of a list of {@link router.Route}s, as well as the HTTP pathnames that the
 * {@link router.Route}s can be accessed by.
 *
 * The {@link router.Route}s are grouped by authorization level. Some routes are
 * accessed by unauthenticated (i.e., not signed in) users. Some routes are accessed by partially
 * authenticated users (c.f. {@link authProvider.PartialUserSession}). That is, users who have
 * signed up but who have not completed email verification or set a username. The remaining
 * {@link router.Route}s require fully authenticated users (c.f.
 * {@link authProvider.FullUserSession}). */

import * as react from "react";
import * as toast from "react-hot-toast";
import * as router from "react-router-dom";

import * as authProvider from "../authentication/providers/auth";
import Dashboard from "../dashboard/components/dashboard";
import * as authService from "../authentication/service";
import withRouter from "../navigation";
import * as loggerProvider from "../providers/logger";
import * as session from "../authentication/providers/session";

// =================
// === Constants ===
// =================

/** Path to the root of the app (i.e., the Cloud dashboard). */
export const DASHBOARD_PATH = "/";

// ================
// === Platform ===
// ================

/** Defines the platform the application is running on. */
export enum Platform {
  /** Application is running on a desktop (i.e., in Electron). */
  desktop = "desktop",
  /** Application is running in the browser (i.e., in the cloud). */
  cloud = "cloud",
}

// ===========
// === App ===
// ===========

/** Global configuration for the `App` component. */
export interface AppProps {
  /** Logger to use for logging. */
  logger: loggerProvider.Logger;
  platform: Platform;
  onAuthenticated: () => void;
}

/** Functional component called by the parent module, returning the root React component for this
 * package.
 *
 * This component handles all the initialization and rendering of the app, and manages the app's
 * routes. It also initializes an `AuthProvider` that will be used by the rest of the app. */
// eslint-disable-next-line @typescript-eslint/naming-convention
const App = (props: AppProps) => {
  const { platform } = props;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const Router =
    platform === Platform.desktop ? router.MemoryRouter : router.BrowserRouter;
  /** Note that the `Router` must be the parent of the `AuthProvider`, because the `AuthProvider`
   * will redirect the user between the login/register pages and the dashboard. */
  return (
    <>
      <toast.Toaster position="top-center" reverseOrder={false} />
      <Router>
        <AppRouterWithHistory {...props} />
      </Router>
    </>
  );
};

// =================
// === AppRouter ===
// =================

/** Router definition for the app.
 *
 * The only reason the {@link AppRouter} component is separate from the {@link App} component is
 * because the {@link AppRouter} relies on React hooks, which can't be used in the same React
 * component as the component that defines the provider. */
// eslint-disable-next-line @typescript-eslint/naming-convention
const AppRouter = (props: AppProps) => {
  const { logger, onAuthenticated } = props;
  const navigate = router.useNavigate();
  const memoizedAuthService = react.useMemo(() => {
    const authConfig = { navigate, ...props };
    return authService.initAuthService(authConfig);
  }, [navigate, props]);
  const userSession = memoizedAuthService.cognito.userSession;
  return (
    <loggerProvider.LoggerProvider logger={logger}>
      <session.SessionProvider userSession={userSession}>
        <authProvider.AuthProvider onAuthenticated={onAuthenticated}>
          <router.Routes>
            <react.Fragment>
              {/* Protected pages are visible to authenticated users. */}
              <router.Route element={<authProvider.ProtectedLayout />}>
                <router.Route
                  path={DASHBOARD_PATH}
                  element={<Dashboard />}
                />
              </router.Route>
            </react.Fragment>
          </router.Routes>
        </authProvider.AuthProvider>
      </session.SessionProvider>
    </loggerProvider.LoggerProvider>
  );
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const AppRouterWithHistory = withRouter(AppRouter);

export default App;
