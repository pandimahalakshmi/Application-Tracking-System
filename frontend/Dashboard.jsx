import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Outlet } from "react-router-dom";

export default function Dashboard() {

  return (

    <div className="min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64">

        <Header />

        <div className="p-8">

          <Outlet />

        </div>

      </div>

    </div>

  );

}