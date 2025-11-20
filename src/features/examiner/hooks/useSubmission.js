import { useState } from 'react';
import { submissionService } from '../services/submissionService';

export const useSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAssignedSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await submissionService.getAssignedSubmissions();
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const getGradingForm = async (submissionId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await submissionService.getGradingForm(submissionId);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const submitGrading = async (gradingData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await submissionService.submitGrading(gradingData);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const getGradingBySubmission = async (submissionId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await submissionService.getGradingBySubmission(submissionId);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return {
    loading,
    error,
    getAssignedSubmissions,
    getGradingForm,
    submitGrading,
    getGradingBySubmission,
  };
};
