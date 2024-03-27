import axios from 'axios';

const sendEmail = async (email, shortUrl) => {
  try {
    const response = await axios.post('http://localhost:8000/api/send-email', { email, shortUrl });
    console.log('Email sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;
