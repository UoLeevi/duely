import '../src/styles/module.css';

import { MemoryRouter as Router } from 'react-router-dom';
import { ViewportContextProvider, ScreenOverlayContextProvider } from '../src/contexts';

export const decorators = [
  (Story) => (
    <Router>
      <ViewportContextProvider>
        <ScreenOverlayContextProvider>
          <Story />
        </ScreenOverlayContextProvider>
      </ViewportContextProvider>
    </Router>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
