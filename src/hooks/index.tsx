import React, { PropsWithChildren } from 'react';

import { AuthProvider } from './auth';

const AppProvider: React.FC<PropsWithChildren> = ({ children }: PropsWithChildren) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

export default AppProvider;