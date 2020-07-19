import React, { useState, useRef } from 'react';
import Button from '../Button';

export default {
  title: 'Button',
  component: Button,
};

const errors = [
  'some error occured',
  'some error occured with unnecessarily long description text and maybe some error codes and stuff'
];

export const Default = () => {
  const counterRef = useRef(-1);
  const [loading, setLoading] = useState();
  const [loadingError, setLoadingError] = useState();
  const [loadingCompleted, setLoadingCompleted] = useState();
  const [error, setError] = useState();
  const [completed, setCompleted] = useState();

  const showLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  const showError = () => {
    if (++counterRef.current % 3) {
      setLoadingError(true);
      setTimeout(() => {
        setLoadingError(false);
        setError(errors[counterRef.current % errors.length]);
        setTimeout(() => setError(null), 4000);
      }, 1000);
    } else {
      setError(errors[++counterRef.current % errors.length]);
      setTimeout(() => setError(null), 4000);
    }
  }

  const showCompleted = () => {
    if (++counterRef.current % 3) {
      setLoadingCompleted(true);
      setTimeout(() => {
        setLoadingCompleted(false);
        setCompleted('everything is in order');
        setTimeout(() => setCompleted(null), 4000);
      }, 1000);
    } else {
      setCompleted('everything is in order');
      setTimeout(() => setCompleted(null), 4000);
    }
  }

  return (
    <div>
      <span className="f-b f-2">States</span>
      <div className="flex row gap-1 mt-2 mb-3">
        <Button loading={ loading } onClick={ showLoading } areaWidth="40ch">Click for loading</Button>
      </div>
      <div className="flex row gap-1 mt-2 mb-3">
        <Button loading={ loadingError } error={ error } onClick={ showError } areaWidth="40ch">Click for error</Button>
      </div>
      <div className="flex row gap-1 mt-2 mb-3">
        <Button loading={ loadingCompleted } completed={ completed } onClick={ showCompleted } areaWidth="40ch">Click for completed</Button>
      </div>
      <code className="f-b f-2">outlined (default)</code>
      <div className="flex row gap-1 mt-2 mb-3">
        <Button dense>Dense</Button>
        <Button>Default</Button>
        <Button prominent>Prominent</Button>
      </div>
      <code className="f-b f-2">filled</code>
      <div className="flex row gap-1 mt-2 mb-3">
        <Button filled dense>Dense</Button>
        <Button filled>Default</Button>
        <Button filled prominent>Prominent</Button>
      </div>
      <code className="f-b f-2">filled color="primary"</code>
      <div className="flex row gap-1 mt-2 mb-3">
        <Button filled dense color="primary">Dense</Button>
        <Button filled color="primary">Default</Button>
        <Button filled prominent color="primary">Prominent</Button>
      </div>
      <code className="f-b f-2">flat color="primary"</code>
      <div className="flex row gap-1 mt-2 mb-3">
        <Button flat dense color="primary">Dense</Button>
        <Button flat color="primary">Default</Button>
        <Button flat prominent color="primary">Prominent</Button>
      </div>
      <code className="f-b f-2">text color="primary"</code>
      <div className="flex row gap-1 mt-2 mb-3">
        <Button text color="primary">Default</Button>
      </div>
    </div>
  );
};
