import { useState } from 'react';
import { uploadSubmissionService } from '../services/uploadSubmissionService';

export const useUploadSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadZipBatch = async (examId, file) => {
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const response = await uploadSubmissionService.uploadZipBatch(
        examId,
        file,
        (progress) => setUploadProgress(progress)
      );
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      setUploadProgress(0);
      throw err;
    }
  };

  return {
    loading,
    error,
    uploadProgress,
    uploadZipBatch,
  };
};
