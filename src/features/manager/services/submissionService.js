import axiosClient from '../../../lib/axios';

export const managerSubmissionService = {
  // Get submissions by exam ID (exam must not be Closed)
  getSubmissionsByExam: async (examId) => {
    try {
      const response = await axiosClient.get(`/submissions/exam/${examId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get submission by ID
  getSubmissionById: async (submissionId) => {
    try {
      const response = await axiosClient.get(`/submissions/${submissionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all extracted submissions (ready to assign)
  getExtractedSubmissions: async () => {
    try {
      const response = await axiosClient.get('/submissions/extracted');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Assign submissions to examiner
  assignSubmissions: async (assignData) => {
    try {
      const response = await axiosClient.post('/submissions/assign', assignData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Approve a graded submission
  approveSubmission: async (submissionId) => {
    try {
      const response = await axiosClient.post(`/submissions/${submissionId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reject a submission with optional reason
  rejectSubmission: async (submissionId, reason) => {
    try {
      const response = await axiosClient.post(`/submissions/${submissionId}/reject`, {
        reason,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark a submission for regrading
  markForRegrading: async (submissionId) => {
    try {
      const response = await axiosClient.post(`/submissions/${submissionId}/regrade`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
