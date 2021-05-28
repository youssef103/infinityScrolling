import axios from 'axios';

const baseUrl = 'https://jsonplaceholder.typicode.com';

export const httpServices = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  baseUrl,
};
