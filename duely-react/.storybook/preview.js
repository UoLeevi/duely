import React from 'react';
import { addDecorator } from '@storybook/react';
import { MemoryRouter as Router } from 'react-router-dom';
import { withViewportContext } from '../src/contexts/ViewportContext';
import { withModalContext } from '../src/contexts/ModalContext';
import '../src/index.css'

addDecorator(withModalContext);
addDecorator(Fn => <Router><Fn /></Router>);
addDecorator(withViewportContext);
