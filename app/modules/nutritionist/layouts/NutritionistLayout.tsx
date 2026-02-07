import { Outlet } from "react-router";
import Sidebar from "~/shared/components/Sidebar";
import MobileNutriNav from "~/shared/components/MobileNutriNav";

export default function NutritionistLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <MobileNutriNav />
    </div>
  );
}
