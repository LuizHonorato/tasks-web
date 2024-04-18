import { extendTheme } from "@chakra-ui/react";

export const light = extendTheme({
  name: 'light',
  styles: {
    global: {
      body: {
        bg: 'white',
        color: 'black.800',
      },
    },
  },
  breakpoints: {
    sm: '320px',
    md: '768px',
    lg: '960px',
    xl: '1200px',
    '2xl': '1536px',
  },
  fonts: {
    body: 'Roboto',
  },
});
