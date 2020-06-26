import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import '../src/index.css'

addDecorator(withKnobs);
addDecorator(withInfo);
