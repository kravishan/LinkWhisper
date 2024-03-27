import axios from 'axios';

const sendEmail = async (email, shortUrl) => {
  try {
    const response = await axios.post('http://localhost:8000/api/send-email', { email, shortUrl });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default sendEmail;
