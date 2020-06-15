import { useContext } from 'react';
import { ModalContext } from '../contexts/ModalContext';

export function useModal(renderContent) {
  const { useModal } = useContext(ModalContext);
  return useModal(renderContent);
}
