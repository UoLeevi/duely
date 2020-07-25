import { Machine, assign, spawn, send, sendParent } from 'xstate';
import { matchRoutes, joinPathParts } from 'routes';

export function createRouteMachine(routes) {
  return Machine({
    id: 'route',
    context: {
      routes,
      activeRoute: undefined,
      pendingRoute: undefined
    },
    initial: 'idle',
    states: {
      idle: {
        on: {
          NAVIGATION_REQUESTED: 'processing'
        }
      },
      processing: {
        initial: 'matching',
        states: {
          matching: {
            invoke: {
              src: 'checkRouteMatches',
              onDone: [
                { target: 'validating', actions: 'clearPendingRoute', cond: 'matchesNothing' },
                { target: 'validating', actions: 'setActiveRouteAsPending', cond: 'matchesActiveRoute' },
                { target: 'validating', actions: 'spawnPendingRoute' }
              ],
              onError: { target: '#route.hist', actions: 'rejectNavigation' }
            }
          },
          validating: {
            invoke: {
              src: 'validatePendingRoute',
              onDone: [
                { target: '#route.idle', actions: 'confirmNavigation', cond: 'noPendingRoute' },
                { target: 'pending', actions: 'requestNavigation' }
              ],
              onError: { target: '#route.hist', actions: 'rejectNavigation' }
            }
          },
          pending: {
            on: {
              NAVIGATION_CONFIRMED: { target: '#route.idle', actions: ['setPendingRouteAsActive', 'forwardToParent'] }
            }
          }
        },
        on: {
          NAVIGATION_REJECTED: { target: '#route.hist', actions: 'forwardToParent' }
        }
      },
      hist: {
        type: 'history',
        history: 'shallow',
        target: 'inactive'
      },
      inactive: {
        type: 'final'
      }
    }
  }, {
    actions: {
      forwardToParent: sendParent((context, event) => event),
      requestNavigation: send((context, event) => ({ ...event.data, type: 'NAVIGATION_REQUESTED' }), { to: context => context.pendingRoute.ref }),
      rejectNavigation: sendParent((context, event) => ({ ...event.data, type: 'NAVIGATION_REJECTED' }), { to: context => context.pendingRoute.ref }),
      confirmNavigation: sendParent((context, event) => {
        const { pathname, basename, ...location } = event.data.location;
        location.pathname = joinPathParts(basename, pathname);
        return { location, type: 'NAVIGATION_CONFIRMED' };
      }),
      setActiveRouteAsPending: assign({ pendingRoute: context => {
        if (context.pendingRoute?.ref.initialized && context.pendingRoute.ref !== context.activeRoute.ref) {
          context.pendingRoute.ref.stop();
        }
        return context.activeRoute;
      }}),
      setPendingRouteAsActive: assign({ activeRoute: context => {
        if (context.activeRoute?.ref.initialized && context.activeRoute.ref !== context.pendingRoute.ref) {
          context.activeRoute.ref.stop();
        }
        return context.pendingRoute;
      }}),
      clearPendingRoute: assign({ pendingRoute: context => {
        if (context.pendingRoute?.ref.initialized) {
          context.pendingRoute.ref.stop();
        }
        return undefined;
      }}),
      spawnPendingRoute: assign({ pendingRoute: (context, event) => {
        if (context.pendingRoute?.ref.initialized) {
          context.pendingRoute.ref.stop();
        }
        return { ...event.data, ref: spawn(createRouteMachine(event.data.route.children)) };
      }})
    },
    services: {
      checkRouteMatches: (context, event) => matchRoutes(event.location, context.routes),
      validatePendingRoute: async (context, event) => {
        const { location } = event.data;

        if (context.pendingRoute?.validate) {
          await context.pendingRoute.validate(location);
        }

        return { location };
      }
    },
    guards: {
      matchesNothing: (context, event) => event.data.route === undefined,
      matchesActiveRoute: (context, event) => context.activeRoute?.ref.initialized && context.activeRoute.ref.state.context.route === event.data.route,
      noPendingRoute: context => context.pendingRoute === undefined
    }
  });
};
