import { useContext } from 'react';
import { MachineContext } from 'contexts/MachineContext';

export default function useAppState() {
  return useContext(MachineContext);
}
