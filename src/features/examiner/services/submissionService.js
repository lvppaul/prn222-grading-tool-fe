import axiosClient from '../../../lib/axios';

export const submissionService = {
  // Get all submissions assigned to current examiner
  getAssignedSubmissions: async () => {
    try {
      const response = await axiosClient.get(`/submissions/examiner`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get grading form for a submission
  getGradingForm: async (submissionId) => {
    try {
      const response = await axiosClient.get(`/submissions/${submissionId}/grading-form`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Submit grading for a submission
  submitGrading: async (gradingData) => {
    try {
      const response = await axiosClient.post('/submissions/grading', gradingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get existing grading
  getGradingBySubmission: async (submissionId) => {
    try {
      const response = await axiosClient.get(`/submissions/${submissionId}/grading`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reject submission with violation reason
  rejectSubmission: async (submissionId, reason) => {
    try {
      const response = await axiosClient.post(`/submissions/${submissionId}/reject`, {
        reason: reason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
