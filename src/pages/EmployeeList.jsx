import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEmployees, deleteEmployee } from '../utils/storage';
import { Edit, Trash2, Printer } from 'lucide-react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState({ search: '', gender: '', status: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => setEmployees(getEmployees());

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(id);
      loadData();
    }
  };

  const handlePrint = () => window.print();

  const filteredData = employees.filter(emp => {
    return (
      emp.fullName.toLowerCase().includes(filter.search.toLowerCase()) &&
      (filter.gender ? emp.gender === filter.gender : true) &&
      (filter.status ? emp.status === filter.status : true)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6 no-print">
        <h2 className="text-2xl font-bold">Employee List</h2>
        <div className="space-x-2">
            <button onClick={handlePrint} className="bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2 float-right ml-2 hover:bg-gray-700"><Printer size={16}/> Print</button>
            <Link to="/employees/add" className="bg-blue-600 text-white px-4 py-2 rounded float-right hover:bg-blue-700">Add Employee</Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 bg-white p-4 rounded shadow no-print">
        <input placeholder="Search by name..." className="border p-2 rounded flex-1" 
          onChange={e => setFilter({...filter, search: e.target.value})} />
        <select className="border p-2 rounded cursor-pointer" onChange={e => setFilter({...filter, gender: e.target.value})}>
            <option value="">All Genders</option><option>Male</option><option>Female</option>
        </select>
        <select className="border p-2 rounded cursor-pointer" onChange={e => setFilter({...filter, status: e.target.value})}>
            <option value="">All Status</option><option>Active</option><option>Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Gender</th>
              <th className="p-4">DOB</th>
              <th className="p-4">State</th>
              <th className="p-4">Status</th>
              <th className="p-4 no-print">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? filteredData.map(emp => (
              <tr key={emp.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                    <img src={emp.image || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-full object-cover"/>
                </td>
                <td className="p-4 font-medium">{emp.fullName}</td>
                <td className="p-4">{emp.gender}</td>
                <td className="p-4">{emp.dob}</td>
                <td className="p-4">{emp.state}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2 no-print">
                  <Link to={`/employees/edit/${emp.id}`} className="text-blue-600 hover:text-blue-800"><Edit size={18}/></Link>
                  <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18}/></button>
                </td>
              </tr>
            )) : <tr><td colSpan="7" className="p-4 text-center text-gray-500">No records found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default EmployeeList;