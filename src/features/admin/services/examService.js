import axiosClient from '../../../lib/axios';

export const examService = {
  createExam: async (formData) => {
    try {
      const response = await axiosClient.post('/exams/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllExams: async () => {
    try {
      const response = await axiosClient.get('/exams');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  publishExam: async (examId) => {
    try {
      const response = await axiosClient.patch(`/exams/${examId}/publish`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  closeExam: async (examId) => {
    try {
      const response = await axiosClient.patch(`/exams/${examId}/close`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllSemesters: async () => {
    try {
      const response = await axiosClient.get('/exams/semesters');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
