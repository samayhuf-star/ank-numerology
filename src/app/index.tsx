import { Redirect } from 'expo-router';
import { useStore } from '../store';
export default function Index() {
  const { s } = useStore();
  return <Redirect href={s.onboarded ? '/(tabs)/today' : '/onboarding'} />;
}
