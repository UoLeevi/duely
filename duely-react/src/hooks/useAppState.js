import { useContext } from 'react';
import { AppStateContext } from 'contexts/AppStateContext';

export default function useAppState() {
  return useContext(AppStateContext);
}
