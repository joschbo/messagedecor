// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import MessageDecorator from './MessageDecorator';

export default function App() {
  return <MantineProvider>
    <Notifications />
    <MessageDecorator />
  </MantineProvider>;
}