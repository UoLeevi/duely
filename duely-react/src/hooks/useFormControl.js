import { FormContext } from 'contexts/FormContext';
import { useContext } from 'react';

export default function useFormControl(ref) {
  const { getControl } = useContext(FormContext);
  return getControl(ref);
}
