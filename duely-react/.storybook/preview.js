import { addDecorator } from '@storybook/react';
import { withViewportContext } from '../src/contexts/ViewportContext';
import { withModalContext } from '../src/contexts/ModalContext';
import '../src/index.css'

addDecorator(withViewportContext);
addDecorator(withModalContext);
