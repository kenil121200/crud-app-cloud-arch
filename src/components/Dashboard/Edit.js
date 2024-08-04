import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { edit_employee, get_image, upload_image } from '../../backend';

const Edit = ({ employees, selectedEmployee, setEmployees, setIsEditing }) => {
  const id = selectedEmployee.uid;
  const uid = selectedEmployee.uid;
  const [firstName, setFirstName] = useState(selectedEmployee.firstName);
  const [lastName, setLastName] = useState(selectedEmployee.lastName);
  const [email, setEmail] = useState(selectedEmployee.email);
  const [salary, setSalary] = useState(selectedEmployee.salary);
  const [date, setDate] = useState(selectedEmployee.date);
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  useEffect(() => {
    // Fetch the existing image
    const fetchImage = async () => {
      const data = {
        filename: `${id}.jpeg`,
      };
      const response = await get_image(data);
      if (response && response.image_data) {
        setExistingImage(`data:image/jpeg;base64,${response.image_data}`);
      }
    };
    fetchImage();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !salary || !date) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    if (image) {
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

        await updateEmployeeDetails();
      };
    } else {
      await updateEmployeeDetails();
    }
  };

  const updateEmployeeDetails = async () => {
    const employee = {
      id,
      firstName,
      lastName,
      email,
      salary,
      date,
      uid,
    };

    const editedEmployee = await edit_employee(employee);

    for (let i = 0; i < employees.length; i++) {
      if (employees[i].uid === editedEmployee.uid) {
        employees.splice(i, 1, editedEmployee);
        break;
      }
    }

    setEmployees(employees);
    setIsEditing(false);

    Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text: `${employee.firstName} ${employee.lastName}'s data has been updated.`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div className="small-container">
      <form onSubmit={handleUpdate}>
        <h1>Edit Employee</h1>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="salary">Salary ($)</label>
        <input
          id="salary"
          type="number"
          name="salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <label htmlFor="image">Upload Image</label>
        {existingImage && (
          <div>
            <img src={existingImage} alt="Existing" style={{ width: '100px', height: '100px' }} />
          </div>
        )}
        <input
          id="image"
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <div style={{ marginTop: '30px' }}>
          <input type="submit" value="Update" />
          <input
            style={{ marginLeft: '12px' }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsEditing(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default Edit;
