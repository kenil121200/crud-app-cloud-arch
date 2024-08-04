import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { add_employee, upload_image } from '../../backend';

const Add = ({ employees, setEmployees, setIsAdding }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [salary, setSalary] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !salary || !date || !image) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    const id = Math.floor(Math.random() * 100000) + 1;
    const newEmployee = {
      id,
      firstName,
      lastName,
      email,
      salary,
      date,
      uid: id,
    };

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1];
      const uploadImageData = {
        data: base64Image,
        filename: `${id}.jpeg`,
      };

      const imageResponse = await upload_image(uploadImageData);
      if (!imageResponse) {
        return Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Image upload failed.',
          showConfirmButton: true,
        });
      }

      const newEmployeeResponse = await add_employee(newEmployee);
      if (newEmployeeResponse) {
        employees.push(newEmployee);
        setEmployees(employees);
        setIsAdding(false);
      }

      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: `${firstName} ${lastName}'s data has been added.`,
        showConfirmButton: false,
        timer: 1500,
      });
    };
  };

  return (
    <div className="small-container">
      <form onSubmit={handleAdd}>
        <h1>Add Employee</h1>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          name="firstName"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label htmlFor="salary">Salary ($)</label>
        <input
          id="salary"
          type="number"
          name="salary"
          value={salary}
          onChange={e => setSalary(e.target.value)}
        />
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <label htmlFor="image">Upload Image</label>
        <input
          id="image"
          type="file"
          name="image"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
        />
        <div style={{ marginTop: '30px' }}>
          <input type="submit" value="Add" />
          <input
            style={{ marginLeft: '12px' }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsAdding(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default Add;
