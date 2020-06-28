import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { withViewportContext } from '../src/contexts/ViewportContext';
import { withModalContext } from '../src/contexts/ModalContext';
import '../src/index.css'

addDecorator(withKnobs);
addDecorator(withInfo);
addDecorator(withViewportContext);
addDecorator(withModalContext);
