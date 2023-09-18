import { Provider } from 'react-redux';

import { store } from '@/store';

/** 2023/09/18 - `redux`의 `Provider` - by 1-blue */
const MyReduxProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default MyReduxProvider;
