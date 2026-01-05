import { useEffect, useState, useRef } from 'react';
import { getEmployees, saveEmployee } from '../utils/storage';
import { Users, UserCheck, UserX } from 'lucide-react';

// Real Data Card
const StatCard = ({ title, count, icon: Icon, color }) => (
  <div className="p-6 bg-white rounded-lg shadow-sm border flex items-center transition-transform hover:scale-105">
    <div className={`p-4 rounded-full ${color} text-white mr-4`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold">{count}</h3>
    </div>
  </div>
);

// Skeleton Loader Card
const SkeletonCard = () => (
  <div className="p-6 bg-white rounded-lg shadow-sm border flex items-center animate-pulse">
    {/* Icon Placeholder */}
    <div className="w-14 h-14 rounded-full bg-gray-200 mr-4"></div>
    <div className="flex-1">
      {/* Title Placeholder */}
      <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
      {/* Count Placeholder */}
      <div className="h-8 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  
  // Ref to prevent double fetch in Strict Mode
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const data = getEmployees();
    
    // If no data exists, fetch from API (same as EmployeeList)
    if (data.length === 0) {
      fetchMockData();
    } else {
      calculateStats(data);
      setLoading(false);
    }
  }, []);

  const fetchMockData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://randomuser.me/api/?results=10&nat=in');
      const json = await response.json();
      
      const formattedUsers = json.results.map(user => ({
        id: crypto.randomUUID(),
        fullName: `${user.name.first} ${user.name.last}`,
        email: user.email,
        gender: user.gender.charAt(0).toUpperCase() + user.gender.slice(1),
        dob: user.dob.date.split('T')[0],
        state: user.location.state,
        image: user.picture.large,
        status: Math.random() > 0.5 ? 'Active' : 'Inactive'
      }));

      // Save to local storage so other pages can access it
      formattedUsers.forEach(user => saveEmployee(user));
      
      calculateStats(formattedUsers);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    setStats({
      total: data.length,
      active: data.filter(e => e.status === 'Active').length,
      inactive: data.filter(e => e.status === 'Inactive').length,
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard title="Total Employees" count={stats.total} icon={Users} color="bg-blue-500" />
            <StatCard title="Active Employees" count={stats.active} icon={UserCheck} color="bg-green-500" />
            <StatCard title="Inactive Employees" count={stats.inactive} icon={UserX} color="bg-red-500" />
          </>
        )}
      </div>
    </div>
  );
};
export default Dashboard;