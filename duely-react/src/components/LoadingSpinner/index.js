import React from 'react';
import './LoadingSpinner.css'

const LoadingSpinner = ({ loading = true, size = '100%', className, ...props }) => {
  className = Array.from(new Set(((className ?? '') + ' loading-spinner' + (loading ? ' loading' : '')).split(' '))).join(' ');
  props = { className, height: size, ...props };

  return (
    <svg viewBox="-300 -300 600 600" xmlns="http://www.w3.org/2000/svg" stroke="#000000" { ...props }>
      <path fill="none" strokeWidth="20" d="M-4.29,-59.19a100,100,0,1,0,-170.71,-70.71l0,241.4z" shapeRendering="geometricPrecision" />
      <path fill="none" strokeWidth="20" d="M53.41,25.88a100,100,0,1,0,146.59,-112.48l-209.06,-120.7z" shapeRendering="geometricPrecision" />
      <path fill="none" strokeWidth="20" d="M-49.12,33.31a100,100,0,1,0,24.12,183.19l209.06,-120.7z" shapeRendering="geometricPrecision" />
    </svg>
  );
};

export default LoadingSpinner;
