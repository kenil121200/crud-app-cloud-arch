import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

import Header from './Header';
import Table from './Table';
import Add from './Add';
import Edit from './Edit';

import { get_employees, delete_employee, delete_image } from '../../backend';

const Dashboard = ({ setIsAuthenticated }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await get_employees();
      if (response?.employeesList) {
        setEmployees(response.employeesList);
      }
    };
    fetchEmployees();
  }, []);

  const handleEdit = id => {
    const [employee] = employees.filter(employee => employee.uid === id);

    setSelectedEmployee(employee);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(async result => {
      if (result.value) {
        const [employee] = employees.filter(employee => employee.uid === id);

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `${employee.firstName} ${employee.lastName}'s data has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        });

        const deletedEmployee = await delete_employee(id);
        if (deletedEmployee) {
          const deleteImageData = {
            filename: `${id}.jpeg`,
          };
          await delete_image(deleteImageData);
          const employeesCopy = employees.filter(employee => employee.uid !== id);
          setEmployees(employeesCopy);
        }
      }
    });
  };

  return (
    <div className="container">
      {!isAdding && !isEditing && (
        <>
          <Header
            setIsAdding={setIsAdding}
            setIsAuthenticated={setIsAuthenticated}
          />
          <Table
            employees={employees}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </>
      )}
      {isAdding && (
        <Add
          employees={employees}
          setEmployees={setEmployees}
          setIsAdding={setIsAdding}
        />
      )}
      {isEditing && (
        <Edit
          employees={employees}
          selectedEmployee={selectedEmployee}
          setEmployees={setEmployees}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default Dashboard;
