const STORAGE_KEY = 'employee_data';

export const getEmployees = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveEmployee = (employee) => {
  const employees = getEmployees();
  const index = employees.findIndex(e => e.id === employee.id);
  
  if (index !== -1) {
    employees[index] = employee;
  } else {
    if(!employee.id) employee.id = Date.now().toString(); 
    employees.push(employee);
  }
  localStorage.setItem('employee_data', JSON.stringify(employees));
};

export const deleteEmployee = (id) => {
  const employees = getEmployees().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
};