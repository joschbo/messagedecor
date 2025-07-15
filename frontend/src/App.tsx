// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import MessageDecorator from './MessageDecorator';

export default function App() {
  const theme = createTheme({});
  return <MantineProvider theme={theme}>
    <Notifications />
    <MessageDecorator />
  </MantineProvider>;
}