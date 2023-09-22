import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import GeneralLayout from '@/layouts/GeneralLayout';
import MyReduxProvider from '@/providers/MyReduxProvider';
import MySWRProvider from '@/providers/MySWRProvider';
import MyStyledProvider from '@/providers/MyStyledProvider';

import type { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
  const { fallback } = pageProps;

  return (
    <MyReduxProvider>
      <MySWRProvider fallback={fallback || {}}>
        <MyStyledProvider>
          <GeneralLayout>
            <Component {...pageProps} />

            <ToastContainer autoClose={2000} position="top-center" />
          </GeneralLayout>
        </MyStyledProvider>
      </MySWRProvider>
    </MyReduxProvider>
  );
};

export default App;
