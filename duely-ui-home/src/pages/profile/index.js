import { Link, Route, Switch } from 'react-router-dom';
import { useQuery, current_user_agencies_Q, current_user_Q } from '@duely/client';
import { LoadingScreen, ErrorScreen } from '@duely/react';
import ProfileHome from './home';
import { ProfileLayout } from './components';

const routes = [
  {
    path: '/',
    component: ProfileHome
  }
];

export default function Profile() {
  const { data: current_user } = useQuery(current_user_Q);
  const { loading, error } = useQuery(current_user_agencies_Q);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;

  if (current_user == null) {
    return (
      <div className="grid h-full w-full place-items-center">
        <div className="flex flex-col m-3 space-y-1 items-center">
          <span className="font-medium text text-gray-700">You need to log in before you can access your profile</span>
          <Link className="font-medium text-lg text-indigo-600" to="/log-in">Go to log in page</Link>
        </div>
      </div>
    );
  }

  return (
    <ProfileLayout>
      <Switch>
        {routes.map((route, i) => <Route key={i} {...route} />)}
      </Switch>
    </ProfileLayout>
  );
}
