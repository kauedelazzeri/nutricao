import { Outlet } from "react-router";
import BottomTabBar from "~/shared/components/BottomTabBar";

export default function PatientLayout() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Outlet />
      <BottomTabBar />
    </div>
  );
}
