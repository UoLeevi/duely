import { Machine, assign, spawn, send, sendParent, actions } from 'xstate';
import { joinPathParts } from 'utils';
import { matchPath } from 'routes';
const { pure } = actions;

export const routeCallbacks = {
  beforeEnter: new WeakMap(),
  enter: new WeakMap(),
  beforeExit: new WeakMap(),
  exit: new WeakMap(),
  rejected: new WeakMap()
}

function executeCallbacks(type) {
  const routeKey = {
    beforeEnter: 'pending',
    enter: 'pending',
    beforeExit: 'active',
    exit: 'active',
    rejected: 'active'
  }[type];

  return async (context, event) => {
    if (!context[routeKey]) {
      return undefined;
    }

    const route = context[routeKey].route;
    const data = await route[type]?.(context[routeKey]);
    const callbacks = routeCallbacks[type].get(route);

    for (const [ref, callback] of callbacks ?? []) {
      ref.current = await callback(context[routeKey]);
    }

    return data;
  }
}

export function getActivePath(ref) {
  let active;

  while (ref.state.context.active) {
    active = ref.state.context.active;
  }

  return active?.path ?? '/';
}

export function createRouteMachine(routes, base = '/') {
  return Machine({
    id: 'route',
    context: {
      routes,
      base,
      params: undefined,
      active: undefined,
      pending: undefined,
      request: undefined
    },
    initial: 'idle',
    states: {
      idle: {
        on: {
          NAVIGATION_CONFIRMED: { actions: 'confirmNavigation' },
          NAVIGATION_REQUESTED: [
            { actions: 'confirmNavigation', cond: 'isFullyMatched' },
            { actions: ['captureRequest', 'requestNavigation'], cond: 'matchesActiveRoute' },
            { target: 'matching', actions: 'captureRequest' }
          ],
          ROUTE_MATCHING_REQUESTED: [
            { actions: 'routeMatched', cond: 'isFullyMatched' },
            { target: 'matching' }
          ],
          ROUTE_EXIT_REQUESTED: [
            { target: 'beforeExit', cond: 'noActiveRoute' },
            { actions: 'requestRouteExit' }
          ],
          ROUTE_ENTER_REQUESTED: [
            { actions: 'allowRouteEnter', cond: 'noPendingRoute' },
            { target: 'beforeEnter' }
          ],
          ROUTE_EXIT_ALLOWED: [
            { target: 'beforeEnter', cond: 'isUninitializedRequestRoot' },
            { target: 'beforeExit', cond: 'isRequestRoot' },
            { actions: 'forwardToParent' }
          ],
          ROUTE_EXIT: [
            { actions: 'routeExited', cond: 'noActiveRoute' },
            { actions: 'exitRoute' }
          ],
          ROUTE_EXITED: 'exiting',
          ROUTE_ENTER: [
            { actions: 'routeEntered', cond: 'noPendingRoute' },
            { target: 'entering' }
          ]
        }
      },
      matching: {
        invoke: {
          src: 'determineNextRoute',
          onDone: { actions: 'requestRouteMatching' },
          onError: { target: 'idle', actions: 'rejectNavigation' }
        },
        on: {
          ROUTE_MATCHED: [
            { target: 'beforeEnter', cond: 'isUninitializedRequestRoot' },
            { target: 'idle', actions: 'requestRouteExit', cond: 'isRequestRoot' },
            { target: 'idle', actions: 'routeMatched' }
          ]
        }
      },
      beforeExit: {
        invoke: {
          src: 'beforeRouteExit',
          onDone: [
            { target: 'idle', actions: ['updateActiveData', 'allowRouteExit'], cond: 'noPendingRoute' },
            { target: 'beforeEnter', actions: 'updateActiveData', cond: 'isRequestRoot' },
            { target: 'idle', actions: ['updateActiveData', 'allowRouteExit'] }
          ],
          onError: { target: 'idle', actions: 'rejectNavigation' }
        }
      },
      beforeEnter: {
        invoke: {
          src: 'beforeRouteEnter',
          onDone: { actions: ['updatePendingData', 'requestRouteEnter'] },
          onError: { target: 'idle', actions: 'rejectNavigation' }
        },
        on: {
          ROUTE_ENTER_ALLOWED: [
            { target: 'entering', cond: 'isUninitializedRequestRoot' },
            { target: 'idle', actions: 'exitRoute', cond: 'isRequestRoot' },
            { target: 'idle', actions: 'forwardToParent' },
          ]
        }
      },
      exiting: {
        invoke: {
          src: 'onRouteExit',
          onDone: [
            { target: 'idle', actions: 'routeExited', cond: 'noPendingRoute' },
            { target: 'entering' }
          ],
          onError: [
            { target: 'idle', actions: 'routeExited', cond: 'noPendingRoute' },
            { target: 'entering' }
          ]
        }
      },
      entering: {
        invoke: {
          src: 'onRouteEnter',
          onDone: { actions: 'enterRoute' },
          onError: { actions: 'enterRoute' }
        },
        on: {
          ROUTE_ENTERED: [
            { target: 'idle', actions: 'confirmNavigation', cond: 'isRequestRoot' },
            { target: 'idle', actions: 'forwardToParent' }
          ]
        }
      },
      rejected: {
        invoke: {
          src: 'onNavigationRejected',
          onDone: { target: 'idle' },
          onError: { target: 'idle' }
        }
      }
    },
    on: {
      NAVIGATION_REJECTED: { target: 'rejected', actions: 'forwardToParent' }
    }
  }, {
    actions: {
      forwardToParent: sendParent((context, event) => event),
      captureRequest: assign({ request: (context, event) => event }),
      rejectNavigation: pure(() => [
        assign({
          request: () => undefined,
          pending: context => {
            if (context.pending) {
              context.pending.ref.stop();
            }

            return undefined;
          }
        }),
        sendParent('NAVIGATION_REJECTED')
      ]),
      requestNavigation: send((context, event) => {
        return { ...event, type: 'NAVIGATION_REQUESTED' }
      }, { to: context => context.active.ref }),
      requestRouteMatching: pure((context, event) => {
        const { route, path, params, location } = event.data;
        const base = joinPathParts(context.base, route.path);
        const ref = spawn(createRouteMachine(route.children, base));
        return [
          assign({ pending: () => ({ path, params, route, ref }) }),
          send({ location, type: 'ROUTE_MATCHING_REQUESTED' }, { to: context => context.pending.ref })
        ]
      }),
      routeMatched: sendParent('ROUTE_MATCHED'),
      requestRouteEnter: send('ROUTE_ENTER_REQUESTED', { to: context => context.pending.ref }),
      allowRouteExit: sendParent('ROUTE_EXIT_ALLOWED'),
      allowRouteEnter: sendParent('ROUTE_ENTER_ALLOWED'),
      enterRoute: pure(() => [
        assign((context, event) => {
          return {
            ...context,
            pending: undefined,
            active: {
              ...context.pending,
              data: {
                ...context.pending.data,
                ...event.data
              }
            }
          };
        }),
        send('ROUTE_ENTER', { to: context => context.active.ref })
      ]),
      routeEntered: sendParent('ROUTE_ENTERED'),
      routeExited: pure((context, event) => {
        return [
          assign({
            active: (context) => {
              if (context.active) {
                context.active.ref.stop();
              }

              return undefined;
            }
          }),
          sendParent({ ...event, type: 'ROUTE_EXITED' })
        ];
      }),
      exitRoute: send('ROUTE_EXIT', { to: context => context.active.ref }),
      requestRouteExit: send('ROUTE_EXIT_REQUESTED', { to: context => context.active.ref }),
      confirmNavigation: sendParent(context => {
        const { request } = context;
        context.request = undefined;
        return { ...request, type: 'NAVIGATION_CONFIRMED' };
      }),
      updateActiveData: assign({
        active: (context, event) => context.active && ({
          ...context.active,
          data: {
            ...context.active.data,
            ...event.data
          }
        })
      }),
      updatePendingData: assign({
        pending: (context, event) => ({
          ...context.pending,
          data: {
            ...context.pending.data,
            ...event.data
          }
        })
      })
    },
    services: {
      determineNextRoute: async (context, event) => {
        function compareRouteSpecificity(a, b) {
          // TODO: score could be memoized
          const aScore = a.path.split('/').filter(p => p !== '').length;
          const bScore = b.path.split('/').filter(p => p !== '').length;

          return aScore === bScore ? 0 : aScore > bScore ? -1 : 1;
        }

        const { location } = event;

        const routes = [...context.routes].sort(compareRouteSpecificity);

        for (const route of routes) {
          const end = (route.children?.length ?? 0) === 0;
          const path = joinPathParts(context.base, route.path);
          const { path: matchedPath, params, index } = matchPath({ path, end }, location.pathname || '/') ?? {};

          if (index === 0) {
            return { route, path: matchedPath, params, location };
          }
        }

        throw new Error('No matching route');
      },
      beforeRouteExit: executeCallbacks('beforeExit'),
      beforeRouteEnter: executeCallbacks('beforeEnter'),
      onRouteExit: executeCallbacks('exit'),
      onRouteEnter: executeCallbacks('enter'),
      onNavigationRejected: executeCallbacks('rejected')
    },
    guards: {
      isUninitializedRequestRoot: context => context.request !== undefined && !context.active,
      isRequestRoot: context => context.request !== undefined,
      matchesActiveRoute: (context, event) => {
        if (!context.active) return false;
        const { pathname } = event.location;
        const route = context.active.route;
        const path = joinPathParts(context.base, route.path);
        const end = (route.children?.length ?? 0) === 0;
        const { path: matchedPath, index } = matchPath({ path, end }, pathname || '/') ?? {};
        return index === 0 && matchedPath === context.active.path;
      },
      isFullyMatched: (context, event) => {
        if (context.routes?.length) return false;
        const { pathname } = event.location;
        const { index } = matchPath({ path: context.base, end: true }, pathname || '/') ?? {};
        return index === 0;
      },
      noActiveRoute: context => !context.active,
      noPendingRoute: context => !context.pending
    }
  });
};
