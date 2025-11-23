import axios from 'axios';

// Docker setup maps port 3000, but browser accesses via localhost
const API_URL = 'http://localhost:3000';

export const fetchGridStatus = async (hour: number) => {
  const response = await axios.get(`${API_URL}/grid-status/${hour}`);
  return response.data;
};

export const fetchJobs = async () => {
  const response = await axios.get(`${API_URL}/jobs`);
  return response.data;
};
