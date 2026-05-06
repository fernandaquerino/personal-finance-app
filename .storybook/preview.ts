import type { Preview } from '@storybook/react';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f2f2f2' },
        { name: 'white', value: '#ffffff' },
        { name: 'dark', value: '#201f24' },
      ],
    },
  },
};

export default preview;
