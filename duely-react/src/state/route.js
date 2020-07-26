import { Machine, assign, spawn, send, sendParent } from 'xstate';
import { matchRoutes, joinPathParts } from 'routes';

export function createRouteMachine(routes) {
  return Machine({
    id: 'route',
    context: {
      routes,
      activeRoute: undefined,
      pendingRoute: undefined,
      data: undefined
    },
    initial: 'idle',
    states: {
      idle: {
        on: {
          NAVIGATION_REQUESTED: 'processing',
          UNBLOCKING_REQUESTED: 'unblocking'
        }
      },
      unblocking: {
        invoke: {
          src: 'unblockActiveRoute',
          onDone: [
            { target: 'idle', actions: 'unblockNavigation', cond: 'noActiveRoute' },
            { actions: 'requestUnblocking' }
          ],
          onError: { target: '#route.idle', actions: 'rejectNavigation' }
        },
        on: {
          NAVIGATION_UNBLOCKED: { target: '#route.idle', actions: ['forwardToParent'] }
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
                { target: '#route.idle', actions: ['assignData', 'confirmNavigation'], cond: 'noPendingRoute' },
                { actions: ['assignData', 'requestNavigation'] }
              ],
              onError: { target: '#route.hist', actions: 'rejectNavigation' }
            },
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
      unblockNavigation: sendParent((context, event) => ({ ...event.data, type: 'NAVIGATION_UNBLOCKED' })),
      requestNavigation: send((context, event) => ({ ...event.data, type: 'NAVIGATION_REQUESTED' }), { to: context => context.pendingRoute.ref }),
      requestUnblocking: send((context, event) => ({ ...event.data, type: 'UNBLOCKING_REQUESTED' }), { to: context => context.activeRoute.ref }),
      rejectNavigation: sendParent((context, event) => ({ ...event.data, type: 'NAVIGATION_REJECTED' })),
      confirmNavigation: sendParent((context, event) => {
        const { action, retry, location: { pathname, basename, ...location } } = event.data;
        location.pathname = joinPathParts(basename, pathname);
        return { action, retry, location, type: 'NAVIGATION_CONFIRMED' };
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
      }}),
      assignData: assign({ data: (context, event) => event.data.data }),
    },
    services: {
      checkRouteMatches: (context, event) => matchRoutes(event, context.routes),
      unblockActiveRoute: async (context, event) => {
        const { location, action } = event;

        if (context.activeRoute?.route.unblock) {
          await context.activeRoute.route.unblock(context, { location });
        }

        return { location, action };
      },
      validatePendingRoute: async (context, event) => {
        const { location, action } = event.data;

        if (context.pendingRoute?.route.validate) {
          const data = await context.pendingRoute.route.validate(context, { location });
          return { location, action, data };
        }

        return { location, action };
      }
    },
    guards: {
      matchesNothing: (context, event) => event.data.route === undefined,
      matchesActiveRoute: (context, event) => context.activeRoute?.ref.initialized && context.activeRoute.ref.state.context.route === event.data.route,
      noActiveRoute: context => context.activeRoute === undefined || !context.activeRoute.ref.initialized,
      noPendingRoute: context => context.pendingRoute === undefined
    }
  });
};
