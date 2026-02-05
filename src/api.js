// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // adresse de ton backend Express
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
