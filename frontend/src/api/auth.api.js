import { api } from "./client.js";

export const registerUser = async (data) => {
    const response = await api.post('/auth/register', data);

    return response.data; // this contains what handleResponse sent
};

export const loginUser = async (data) => {
    const response = await api.post('auth/login', data);

    return response.data;
};

export const logoutUser = async () => {
    const response = await api.post('/auth/logout');

    return response.data;
};

export const deleteUser = async () => {
    const response = await api.delete('auth/me');
    
    return response.data;
}

export const getMe = async () => {
    const response = await api.get('/auth/me');

    return response.data;
};



// -------- it is for success ----------
/*
Response look like this
response = {
    data: {
        success: true,
        message: "Login successful",
        data: {
            user: {
                id: 1,
                name: "Kapil",
                email: "kapil@example.com",
                role: "customer"
            }
        }
    },
    status: 200,
    statusText: "OK",
    headers: {...},
    config: {...},
    request: {...}
}
*/



// -------- it is for error ----------
/*
error = {
  message: "Request failed with status code 400", // Standard Axios text
  response: {
    status: 400,
    data: {
      // <-- Your backend JSON body lives here!
      success: false,
      message: "User with this email already exists"
    }
  }
}
*/