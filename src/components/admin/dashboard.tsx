import Link from "next/link";
import { FaTicketAlt, FaPlane, FaPlaneDeparture, FaNewspaper } from "react-icons/fa";
import { MdLocalAirport } from "react-icons/md";

const Dashboard = () => {
  const menuItems = [
    { id: "tickets", label: "Tickets", icon: <FaTicketAlt />, href: "/dashboard/tickets" },
    { id: "airports", label: "Airports", icon: <MdLocalAirport />, href: "/dashboard/airports" },
    { id: "airplanes", label: "Airplanes", icon: <FaPlane />, href: "/dashboard/airplanes" },
    { id: "flights", label: "Flights", icon: <FaPlaneDeparture />, href: "/dashboard/flights" },
    { id: "articles", label: "Articles", icon: <FaNewspaper />, href: "/dashboard/articles" },
  ];
  return (
    <div className="flex justify-center">
      <div className="flex flex-wrap gap-8 p-6 justify-start">
        {menuItems.map((item) => (
          <Link key={item.id} href={item.href}>
            <div className="flex flex-col items-center justify-center w-32 h-32  sm:w-44 sm:h-44 p-8 border rounded-xl shadow-lg hover:bg-primary-50 transition">
              <span className="text-4xl sm:text-5xl text-primary-500">{item.icon}</span>
              <span className="mt-6 text-base sm:text-xl font-semibold">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
