import { Machine, assign, spawn, send, interpret } from 'xstate';
import { createBrowserHistory, createPath } from 'history';
import { authMachine } from './auth';
// import { profileMachine } from './profile';
import { createRouteMachine } from './route';
import { routes } from 'routes';

let lastNavigation = 0;

export const appMachine = Machine({
  id: 'app',
  type: 'parallel',
  context: {
    user: undefined,
    history: undefined,
    routeRef: undefined,
    routes: [],
    authRef: null
  },
  states: {
    auth: {
      entry: 'spawnAuth'
    },
    routing: {
      entry: ['spawnRoute', 'requestNavigation'],
      on: {
        NAVIGATION: { actions: 'requestNavigation', cond: 'navigationNotHandled' },
        NAVIGATION_REQUESTED: { actions: 'requestNavigation', cond: 'notCurrentlyActive' },
        NAVIGATION_CONFIRMED: { actions: 'updateHistory' },
        NAVIGATION_REJECTED: { actions: 'correctHistory' }
      }
    },
    modal: {
      initial: 'closed',
      states: {
        closed: {},
        open: {}
      }
    }
  },
  on: {
    USER_UPDATED: { actions: ['updateUser'] }
  }
}, {
  actions: {
    spawnAuth: assign({ authRef: context => spawn(authMachine, { sync: true }) }),
    spawnRoute: assign({ routeRef: context => spawn(createRouteMachine(context.routes), { sync: true }) }),
    updateUser: assign({ user: (context, { user }) => user }),
    forwardToRoute: send((context, event) => event, { to: context => context.routeRef }),
    requestNavigation: send((context, event) => ({ location: context.history.location, ...event, type: 'NAVIGATION_REQUESTED' }), { to: context => context.routeRef }),
    updateHistory: (context, event) => {
      if (createPath(context.history.location) !== createPath(event.location)) {
        lastNavigation = Date.now();
        const action = event.action === 'REPLACE' ? 'replace' : 'push';
        context.history[action](event.location, { id: lastNavigation });
      } else if (context.history.location.state?.id === undefined) {
        lastNavigation = Date.now();
        context.history.replace(event.location, { id: lastNavigation });
      }
    },
    correctHistory: (context, event) => {
      // TODO: this is not the right way
      context.history.back();
    }
  },
  guards: {
    isLoggedIn: context => context.user?.type === 'user',
    navigationNotHandled: context => context.history.location.state?.id !== lastNavigation,
    notCurrentlyActive: (context, event) => createPath(context.history.location) !== createPath(event.location)
  }
});

export function createDefaultAppMachineService() {
  const history = createBrowserHistory();
  const service = interpret(appMachine.withContext({
    ...appMachine.context,
    history,
    routes
  }));
  const unlisten = history.listen(({ action, location }) => {
    service.send({ type: 'NAVIGATION', action, location });
  });

  return [
    service,
    () => {
      service.stop();
      unlisten();
    }
  ];
}
