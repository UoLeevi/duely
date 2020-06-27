import React from 'react';
import './Spinner.css'

const Spinner = ({ spin = true, size = '100%' }) => {
  const svgProps = {
    className: 'spinner' + (spin ? ' spin' : ''),
    height: size
  };

  return (
    <svg { ...svgProps } viewBox="-300 -300 600 600" xmlns="http://www.w3.org/2000/svg">
      <path fill="none" stroke="#000000" strokeWidth="20" d="M-4.29,-59.19a100,100,0,1,0,-170.71,-70.71l0,241.4z" shapeRendering="geometricPrecision" />
      <path fill="none" stroke="#000000" strokeWidth="20" d="M53.41,25.88a100,100,0,1,0,146.59,-112.48l-209.06,-120.7z" shapeRendering="geometricPrecision" />
      <path fill="none" stroke="#000000" strokeWidth="20" d="M-49.12,33.31a100,100,0,1,0,24.12,183.19l209.06,-120.7z" shapeRendering="geometricPrecision" />
    </svg>
  );
};

export default Spinner;
