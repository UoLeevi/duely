import { Link, Route, RouteProps, Switch } from 'react-router-dom';
import { useQuery, current_user_agencies_Q, current_user_Q } from '@duely/client';
import { LoadingScreen, ErrorScreen } from '@duely/react';
import ProfileHome from './home';
import { ProfileLayout } from './components';

const routes: RouteProps[] = [
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
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex flex-col items-center m-3 space-y-1">
          <span className="font-medium text-gray-700 text">
            You need to log in before you can access your profile
          </span>
          <Link className="text-lg font-medium text-indigo-600" to="/log-in">
            Go to log in page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProfileLayout>
      <Switch>
        {routes.map((route, i) => (
          <Route key={i} {...route} />
        ))}
      </Switch>
    </ProfileLayout>
  );
}
