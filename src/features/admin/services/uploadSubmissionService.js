import axiosClient from '../../../lib/axios';

export const uploadSubmissionService = {
  // Upload ZIP file containing student submissions
  uploadZipBatch: async (examId, file, onUploadProgress) => {
    try {
      const formData = new FormData();
      formData.append('File', file);
      formData.append('ExamId', examId);

      const response = await axiosClient.post(
        '/grading/codespace-submissions/zip-batch',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (onUploadProgress) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onUploadProgress(percentCompleted);
            }
          },
          timeout: 600000, // 10 minutes timeout for large files
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
