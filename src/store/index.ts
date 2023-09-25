import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import boardModal from '@/store/slices/boardModal';
import spinner from '@/store/slices/spinner';

/** 2023/09/18 - `redux`의 `store` - by 1-blue */
export const store = configureStore({
  reducer: {
    boardModal,
    spinner,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      // 직렬화 불가능한 데이터 예외처리 ( File )
      serializableCheck: {
        ignoredActions: ['boardModal/openBoardModal'],
        ignoredActionPaths: ['meta.arg', 'payload.file'],
        ignoredPaths: ['boardModal.file'],
      },
    });
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

/** 2023/09/18 - 타입이 적용된 `useSelector()` - by 1-blue */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
/** 2023/09/18 - 타입이 적용된 `useDispatch()` - by 1-blue */
export const useAppDispatch: () => AppDispatch = useDispatch;
