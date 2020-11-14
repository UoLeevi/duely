import { Route, Switch } from 'react-router-dom';
import ProfileHome from './home';

const routes = [
  {
    path: '/',
    component: ProfileHome
  }
];

export default function Profile() {
  return (
    <Switch>
      {routes.map((route, i) => <Route key={i} {...route} />)}
    </Switch>
  );
}
