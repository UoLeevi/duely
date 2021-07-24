import { MessageContext, UseMessageReturn } from '../contexts/MessageContext';
import { useContext } from 'react';

export function useMessage(): UseMessageReturn {
  return useContext(MessageContext) as UseMessageReturn;
}
