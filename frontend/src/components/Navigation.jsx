import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/add", label: "Add Transaction", icon: "➕" },
    { path: "/transactions", label: "View Transactions", icon: "📋" }
  ];

  return (
    <nav className="bg-white shadow-md rounded-lg mb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-200 ${
                location.pathname === item.path
                  ? "bg-green-100 text-green-700 border-b-2 border-green-500"
                  : "text-gray-600 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
