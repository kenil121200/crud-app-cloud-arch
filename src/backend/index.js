const callAPI = async (url, method = 'GET', data = {}) => {
    method = method.toUpperCase();
    const namespace = 'https://6u8hf15v17.execute-api.us-east-1.amazonaws.com/prod';
    let requestUrl = `${namespace}/${url}`;
  
    let headers = {
      'Content-Type': 'application/json',
    };
  
    let requestBody = {
      method,
      headers,
    };
  
    if (data) {
      requestBody.body = JSON.stringify(data);
    }

    const response = await fetch(requestUrl, requestBody);
    if (response.ok) {
      const response_json = await response.json();
      return response_json;
    }
    else {
      console.error('Error:', response.text());
      return null;  
    }
    
  };
  

  const get_employees = () => {
    return callAPI('get_employees', 'get', null);
  };
  
  const add_employee = (data) => {
    return callAPI('add_employee', 'post', data);
  };
  
  const edit_employee = (data) => {
    return callAPI('edit_employee', 'PATCH', data);
  }
  
  const delete_employee = (id) => {
    return callAPI(`delete_employee?id=${id}`, 'DELETE', null);
  }

  const upload_image = (data) => {
    return callAPI('uploadImage', 'POST', data);
  }
  
  const get_image = (data) => {
    return callAPI(`getImage`, 'POST', data);
  }

  const delete_image = (data) => {
    return callAPI(`deleteImage`, 'POST', data);
  }
  
  export {
    get_employees,
    add_employee,
    edit_employee,
    delete_employee,
    upload_image,
    get_image,
    delete_image,
  };
  