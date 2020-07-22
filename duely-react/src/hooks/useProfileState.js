import useAppState from 'hooks/useAppState';

export default function useProfileState() {
  const [{ context: { profileRef }},] = useAppState();
  const { state, send } = profileRef;
  return [state, send];
}
