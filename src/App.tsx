import React from 'react';
import { ConfigProvider } from 'antd';
import { AppRouter } from './router/AppRouter';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0284c7',
          borderRadius: 8,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      }}
    >
      <AppRouter />
    </ConfigProvider>
  );
};

export default App;
