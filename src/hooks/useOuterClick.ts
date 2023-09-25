import { useEffect, useRef } from 'react';

/** 2023/09/25 - 외부 클릭 시 닫기 훅 - by 1-blue */
const useOuterClick = <T extends HTMLElement = HTMLElement>(callback: () => void) => {
  const innerRef = useRef<T>(null);

  useEffect(() => {
    const handleClick = (e: Event) => {
      if (!innerRef.current) return;
      if (!(e.target instanceof HTMLElement)) return;
      if (innerRef.current.contains(e.target)) return;

      callback();
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [callback, innerRef]);

  return innerRef;
};

export default useOuterClick;
