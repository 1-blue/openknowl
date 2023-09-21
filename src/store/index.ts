import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import boardModal from '@/store/slices/boardModal';

/** 2023/09/18 - `redux`의 `store` - by 1-blue */
export const store = configureStore({
  reducer: {
    boardModal: boardModal,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

/** 2023/09/18 - 타입이 적용된 `useSelector()` - by 1-blue */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
/** 2023/09/18 - 타입이 적용된 `useDispatch()` - by 1-blue */
export const useAppDispatch: () => AppDispatch = useDispatch;
