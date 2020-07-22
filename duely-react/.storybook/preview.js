import React from 'react';
import { addDecorator } from '@storybook/react';
import { MemoryRouter as Router } from 'react-router-dom';
import { withViewportContext } from '../src/contexts/ViewportContext';
import { withAnimationContext } from '../src/contexts/AnimationContext';
import { withModalContext } from '../src/contexts/ModalContext';
import { withFormContext } from '../src/contexts/FormContext';
import '../src/styles';

addDecorator(withModalContext);
addDecorator(withFormContext);
addDecorator(withAnimationContext)
addDecorator(withViewportContext);
addDecorator(Fn => <Router><Fn /></Router>);
