import axios from 'axios';

const API_URL = 'http://localhost:8000';

const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    return response.data?.status === 'healthy';
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

export const getTranslation = async (text: string, language: string): Promise<string> => {
  console.log('Translation request:', { text, language });
  
  // Check if backend is available
  const isHealthy = await checkBackendHealth();
  if (!isHealthy) {
    console.error('Backend server is not available');
    throw new Error('Translation service is currently unavailable. Please ensure the backend server is running.');
  }

  try {
    const response = await axios.post(`${API_URL}/translate`, {
      text,
      language
    });
    
    console.log('Translation response:', response.data);
    
    if (!response.data?.translation) {
      throw new Error('Invalid translation response');
    }
    
    return response.data.translation;
  } catch (error) {
    console.error('Translation error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    });
    throw error;
  }
};