import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { saveEmployee, getEmployees } from '../utils/storage';
import { INDIAN_STATES } from '../utils/constants';

const mapObj = {
  fullName: 'Full Name', 
  email: 'Email', 
  gender: 'Gender', 
  dob: 'Date Of Birth', 
  state: 'State', 
  status: 'Status', 
}

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    fullName: '', email: '', gender: '', dob: '', state: '', status: '', image: ''
  });

  const [errors, setErrors] = useState({}); // State to track field errors
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (id) {
      const emp = getEmployees().find(e => e.id === id);
      if (emp) {
        setFormData(emp);
        setPreview(emp.image);
      }
    }
  }, [id]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name] && value != '') {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    else if(value == ''){
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
        setErrors(prev => ({ ...prev, image: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  // useEffect(() => {
  //   if(errors){
  //     validateForm();
  //   }
  // },[formData])

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.status) newErrors.status = 'Status is required';

    // Optional: Validate Image
    // if (!formData.image) newErrors.image = 'Profile image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      saveEmployee(formData);
      navigate('/employees');
    }
  };

  // Helper class for inputs
  const getInputClass = (fieldName) =>
    `w-full border p-2 rounded ${errors[fieldName] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Edit' : 'Add'} Employee</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div className="flex items-center space-x-4">
          <div className={`w-20 h-20 bg-gray-200 rounded-full overflow-hidden border-2 ${errors.image ? 'border-red-500' : 'border-gray-300'}`}>
            {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-500">No Img</div>}
          </div>
          <div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm bg-gray-400 p-1 rounded text-black w-min" />
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className={getInputClass('fullName')} />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className={getInputClass('email')} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-2 rounded border-gray-300" required>
              <option hidden>Select Gender</option><option>Male</option><option>Female</option><option>Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>
          <div>
            <input name="dob" type="date" value={formData.dob} onChange={handleChange} className={getInputClass('dob')} max={today} min="1900-01-01"/>
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <select name="state" value={formData.state} onChange={handleChange} className={getInputClass('state')}>
              <option value="">Select State</option>
              {INDIAN_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
          </div>
          <div>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded border-gray-300">
              <option hidden>Select Status</option><option>Active</option><option>Inactive</option>
            </select>
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
          </div>
        </div>

        {/* General Error Message above button */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 text-red-600 p-3 rounded border border-red-200 text-sm text-center">
            Please enter the required data before saving.
          </div>
        )}

        <div className='flex gap-3 justify-end'>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Save Employee</button>
          <button type="button" onClick={() => navigate('/employees')} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">Cancel</button>
        </div>
      </form>
    </div>
  );
};
export default EmployeeForm;