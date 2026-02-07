import { Outlet } from 'react-router';
import BottomTabBar from '~/shared/components/BottomTabBar';

export default function PatientAppLayout() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Outlet />
      <BottomTabBar />
    </div>
  );
}
