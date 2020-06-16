import { useContext } from 'react';
import { ModalContext } from '../contexts/ModalContext';

export function useModal(renderContent, obj = {}) {
  const { useModal } = useContext(ModalContext);
  return useModal(renderContent, obj);
}
