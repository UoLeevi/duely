import { useTemporaryValue } from '../../../hooks';

export function useFormMessages() {
  const {
    value: infoMessage,
    setValue: setInfoMessage,
    reset: resetInfoMessage
  } = useTemporaryValue<string>(4000);
  const {
    value: successMessage,
    setValue: setSuccessMessage,
    reset: resetSuccessMessage
  } = useTemporaryValue<string>(4000);
  const {
    value: errorMessage,
    setValue: setErrorMessage,
    reset: resetErrorMessage
  } = useTemporaryValue<string>(7000);

  return {
    infoMessage,
    setInfoMessage(infoMessage: string) {
      resetErrorMessage();
      resetSuccessMessage();
      setInfoMessage(infoMessage);
    },
    successMessage,
    setSuccessMessage(successMessage: string) {
      resetInfoMessage();
      resetErrorMessage();
      setSuccessMessage(successMessage);
    },
    errorMessage,
    setErrorMessage(errorMessage: string) {
      resetInfoMessage();
      resetSuccessMessage();
      setErrorMessage(errorMessage);
    }
  };
}
