import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { saveEmployee } from '../utils/storage';
import { INDIAN_STATES } from '../utils/constants';

const mapObj = {
  fullName: 'Full Name',
  email: 'Email',
  gender: 'Gender',
  dob: 'Date of Birth',
  state: 'State',
  status: 'Status',
  image: 'Image'
}

const EmployeeModal = ({ isOpen, onClose, employeeToEdit, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', gender: '', dob: '', state: '', status: '', image: ''
  });
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);

  // Reset or Populate form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (employeeToEdit) {
        setFormData(employeeToEdit);
        setPreview(employeeToEdit.image);
      } else {
        // Reset for "Add New"
        setFormData({ fullName: '', email: '', gender: '', dob: '', state: '', status: '', image: '' });
        setPreview(null);
      }
      setErrors({});
    }
  }, [isOpen, employeeToEdit]);

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    else if (!value) {
      setErrors(prev => ({ ...prev, [name]: `${mapObj[name]} is required` }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
        setPreview(reader.result);        
        if (errors.image) {
          setErrors(prev => ({ ...prev, image: '' }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.image) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      saveEmployee(formData);
      onSave(); // Refresh list in parent
      onClose();
    }
  };

  // Helper for Dark Theme Input Styles
  const getInputClass = (fieldName) => 
    `w-full bg-gray-800 text-white border p-2 rounded focus:outline-none focus:ring-2 ${
      errors[fieldName] ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-[2px]">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-900">
          <h3 className="font-bold text-lg text-white">
            {employeeToEdit ? 'Edit Employee' : 'Add New Employee'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="empForm" onSubmit={handleSubmit} className="space-y-4">
            
            {/* Image Upload */}
            <div className="flex items-center space-x-4">
              <div className={`w-20 h-20 bg-gray-800 rounded-full overflow-hidden border-2 ${errors.image ? 'border-red-500' : 'border-gray-600'}`}>
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-xs">No Img</div>
                )}
              </div>
              <div>
                <label className="cursor-pointer bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-600 transition inline-block border border-gray-600">
                  {employeeToEdit ? 'Update Profile Picture' : "Upload Profile Picture"}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} className={getInputClass('fullName')} placeholder="John Doe" />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} className={getInputClass('email')} placeholder="john@example.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className={getInputClass('gender')}>
                    <option hidden>Select Gender</option><option>Male</option><option>Female</option><option>Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Date of Birth</label>
                <input name="dob" type="date" value={formData.dob} onChange={handleChange} className={getInputClass('dob')} max={today} min="1900-01-01" />
                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">State</label>
                <select name="state" value={formData.state} onChange={handleChange} className={getInputClass('state')}>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={getInputClass('status')}>
                    <option hidden>Select Status</option><option>Active</option><option>Inactive</option>
                </select>
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-700 bg-gray-900">
           {/* General Error Message */}
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-600 rounded hover:bg-gray-700">
            Cancel
          </button>
          <button type="submit" form="empForm" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
            {employeeToEdit ? 'Update Changes' : 'Save Employee'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default EmployeeModal;