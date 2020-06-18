import { useContext } from 'react';
import { ModalContext } from '../contexts/ModalContext';

export default function useModal(renderContent, arg = { props: {}, options: {} }) {
  const { useModal } = useContext(ModalContext);
  return useModal(renderContent, arg);
}
