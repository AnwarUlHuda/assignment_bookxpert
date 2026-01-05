import { useState, useEffect, useRef } from 'react';
import { getEmployees, deleteEmployee, saveEmployee } from '../utils/storage';
import { Edit, Trash2, Printer, Plus } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import EmployeeModal from '../components/EmployeeModal'; // Import the new modal

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ search: '', gender: '', status: '' });
  
  // Modal States
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
  const [formModal, setFormModal] = useState({ show: false, data: null }); // New state for Form Modal

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    const data = getEmployees();
      setEmployees(data);
    setTimeout(()=> {
      setLoading(false);
    },100)
  };

  const handleDeleteClick = (emp) => {
    setDeleteModal({ show: true, id: emp.id, name: emp.fullName });
  };

  const confirmDelete = () => {
    deleteEmployee(deleteModal.id);
    loadData();
    setDeleteModal({ show: false, id: null, name: '' });
  };

  // Handlers for Opening Form Modal
  const handleAdd = () => setFormModal({ show: true, data: null });
  const handleEdit = (emp) => setFormModal({ show: true, data: emp });
  
  // Handler for when Form is Saved successfully
  const handleFormSave = () => {
    loadData(); // Reload data
  };

  const handlePrint = () => window.print();

  const filteredData = employees.filter(emp => {
    return (
      emp.fullName.toLowerCase().includes(filter.search.toLowerCase()) &&
      (filter.gender ? emp.gender === filter.gender : true) &&
      (filter.status ? emp.status === filter.status : true)
    );
  });

  const SkeletonRow = () => (
    <tr className="border-b animate-pulse">
        <td className="p-4"><div className="w-10 h-10 bg-gray-200 rounded-full"></div></td>
        <td className="p-4" colSpan="6"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
    </tr>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6 no-print">
        <h2 className="text-2xl font-bold">Employee List</h2>
        <div className="space-x-2 flex">
            <button onClick={handlePrint} className="bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-700">
                <Printer size={16}/> Print
            </button>
            {/* Changed from Link to Button */}
            <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
                <Plus size={16}/> Add Employee
            </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6 bg-white p-4 rounded shadow no-print flex-wrap">
        <input placeholder="Search by name..." className="border p-2 rounded flex-1 min-w-50" 
          onChange={e => setFilter({...filter, search: e.target.value})} />
        <select className="border p-2 rounded" onChange={e => setFilter({...filter, gender: e.target.value})}>
            <option value="">All</option><option>Male</option><option>Female</option>
        </select>
        <select className="border p-2 rounded" onChange={e => setFilter({...filter, status: e.target.value})}>
            <option value="">All</option><option>Active</option><option>Inactive</option>
        </select>
      </div>
      <div className='flex justify-end pb-4 px-4 right-0'>
        <div>Filtered Records : <span className='font-bold'>{filteredData.length}</span></div></div>
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
            {loading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : filteredData.length > 0 ? (
                filteredData.map(emp => (
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
                        {/* Edit Button now triggers Modal */}
                        <button onClick={() => handleEdit(emp)} className="text-blue-600 hover:text-blue-800">
                            <Edit size={18}/>
                        </button>
                        <button onClick={() => handleDeleteClick(emp)} className="text-red-600 hover:text-red-800">
                            <Trash2 size={18}/>
                        </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr><td colSpan="7" className="p-4 text-center text-gray-500">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal 
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null, name: '' })}
        onConfirm={confirmDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteModal.name}? This action cannot be undone.`}
      />

      {/* Add/Edit Employee Modal */}
      <EmployeeModal 
        isOpen={formModal.show}
        onClose={() => setFormModal({ ...formModal, show: false })}
        employeeToEdit={formModal.data}
        onSave={handleFormSave}
      />
    </div>
  );
};
export default EmployeeList;