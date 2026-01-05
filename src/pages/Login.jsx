import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // New state for error
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    // Mock Login Logic
    if (email === 'admin@admin.com' && password === 'admin') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/');
    } else {
      setError('Invalid email or password. Try admin@admin.com / admin');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="mb-6 text-2xl font-bold text-center">HR Portal Login</h2>
        
        <div className="mb-4">
          <label className="block mb-1 text-sm">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => { setEmail(e.target.value); setError(''); }} 
            className={`w-full p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`} 
            placeholder="admin@admin.com" 
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-1 text-sm">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => { setPassword(e.target.value); setError(''); }} 
            className={`w-full p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`} 
            placeholder="admin" 
          />
        </div>

        {/* Error Message Display */}
        {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded text-center border border-red-200">
                {error}
            </div>
        )}

        <button type="submit" className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
};
export default Login;