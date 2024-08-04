import React from 'react';
import Swal from 'sweetalert2';
import { get_image } from '../../backend';

const Table = ({ employees, handleEdit, handleDelete }) => {
  employees.forEach((employee, i) => {
    employee.id = i + 1;
  });

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: null,
  });

  const showImage = async (employeeId, employeeFirst, employeeLast) => {
    try {
      const data = {
        filename: `${employeeId}.jpeg`,
      };
      const response = await get_image(data);

      if (response === null) {
        throw new Error('Failed to fetch image');
      }
      
      const { image_data } = response;
      const imageUrl = `data:image/jpeg;base64,${image_data}`;
      
      Swal.fire({
        title: `${employeeFirst} ${employeeLast}`,
        imageUrl: imageUrl,
        imageAlt: `${employeeFirst} ${employeeLast}`,
        showCloseButton: true,
        width: '60%',
        padding: '2em',
        customClass: {
          image: 'custom-image',
        },
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="contain-table">
      <table className="striped-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Salary</th>
            <th>Date</th>
            <th colSpan={3} className="text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <tr key={employee.uid}>
                <td>{employee.uid}</td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.email}</td>
                <td>{formatter.format(employee.salary)}</td>
                <td>{employee.date}</td>
                <td className="text-right">
                  <button
                    onClick={() => handleEdit(employee.uid)}
                    className="button muted-button"
                  >
                    Edit
                  </button>
                </td>
                <td className="text-left">
                  <button
                    onClick={() => handleDelete(employee.uid)}
                    className="button muted-button"
                  >
                    Delete
                  </button>
                </td>
                <td className="text-left">
                  <button
                    onClick={() => showImage(employee.uid, employee.firstName, employee.lastName)}
                    className="button muted-button"
                  >
                    Show Image
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>No Employees</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;