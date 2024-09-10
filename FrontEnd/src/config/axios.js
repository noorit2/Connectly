import axios from 'axios';

// Create an Axios instance with default settings
export const axiosClient = axios.create({
    baseURL: 'http://localhost:4000/', // Set your API base URL here
    timeout: 10000, // Optional: Set a request timeout
    headers: {
        'Content-Type': 'application/json', 

    }
});
export const axiosProtected = axios.create({
    baseURL: 'http://localhost:4000/', // Set your API base URL here
    timeout: 10000, // Optional: Set a request timeout
    headers: {
        'Content-Type': 'application/json', 
    },
    withCredentials: true // This enables sending credentials with requests
});


