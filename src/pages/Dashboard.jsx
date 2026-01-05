import { useEffect, useState } from 'react';
import { getEmployees } from '../utils/storage';
import { Users, UserCheck, UserX } from 'lucide-react';

const StatCard = ({ title, count, icon: Icon, color }) => (
  <div className="p-6 bg-white rounded-lg shadow-sm border flex items-center">
    <div className={`p-4 rounded-full ${color} text-white mr-4`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold">{count}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  useEffect(() => {
    const data = getEmployees();
    setStats({
      total: data.length,
      active: data.filter(e => e.status === 'Active').length,
      inactive: data.filter(e => e.status === 'Inactive').length,
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Employees" count={stats.total} icon={Users} color="bg-blue-500" />
        <StatCard title="Active Employees" count={stats.active} icon={UserCheck} color="bg-green-500" />
        <StatCard title="Inactive Employees" count={stats.inactive} icon={UserX} color="bg-red-500" />
      </div>
    </div>
  );
};
export default Dashboard;