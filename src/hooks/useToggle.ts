import { useState } from 'react';

type UseToggleProps = boolean;

/** open, close, toggle 훅 */
const useToggle = (initialValue?: UseToggleProps) => {
  const [isOpen, setIsOpen] = useState(!!initialValue);

  /** 열기 */
  const onOpen = () => setIsOpen(true);

  /** 닫기 */
  const onClose = () => setIsOpen(false);

  /** 토글 */
  const onToggle = () => setIsOpen(prev => !prev);

  return { isOpen, onOpen, onClose, onToggle };
};

export default useToggle;
