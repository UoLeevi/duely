import React, { useEffect } from 'react';
import { BsExclamationDiamond, BsExclamationTriangle } from 'react-icons/bs';
import LoadingBar from 'components/LoadingBar';
// import LoadingSpinner from 'components/LoadingSpinner';
import Route from 'components/Route';
import useMessage from 'hooks/useMessage';
import useAppState from 'hooks/useAppState';
import useRouteEvent from 'hooks/useRouteEvent';

const RoutesRoot = () => {
  const [state, ] = useAppState();
  const showInDevelopmentMessage = useMessage(
    <div className="flex row center-v f-b">
      <BsExclamationDiamond className="accent color-l1n pr-3 f-4" />
      <span>Duely is still in development</span>
    </div>
  , { autoHideMs: 10000 });

  useEffect(showInDevelopmentMessage, []);

  const showNavigationRejectedMessage = useMessage(
    <div className="flex row center-v f-b">
      <BsExclamationTriangle className="error color-l1n pr-3 f-4" />
      <span>Sorry! The page in not yet ready.</span>
    </div>
  , { autoHideMs: 4000 });

  useRouteEvent('rejected', showNavigationRejectedMessage);

  return (
    <>
      <LoadingBar loading={ state.matches('navigation.processing') } style={{ position: 'absolute', top: '0', left: '0', zIndex: 1 }} />
      <Route />
      {/* { element ?? <div className="grid w-100 h-100 items-center g-2"><LoadingSpinner size="20%" stroke="var(--color-primary-l4)" /></div> } */}
    </>
  );
};

export default RoutesRoot;
