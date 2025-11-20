import { useState } from 'react';
import { managerSubmissionService } from '../services/submissionService';

export const useManagerSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSubmissionsByExam = async (examId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await managerSubmissionService.getSubmissionsByExam(examId);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const getSubmissionById = async (submissionId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await managerSubmissionService.getSubmissionById(submissionId);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const getExtractedSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await managerSubmissionService.getExtractedSubmissions();
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const assignSubmissions = async (assignData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await managerSubmissionService.assignSubmissions(assignData);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const approveSubmission = async (submissionId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await managerSubmissionService.approveSubmission(submissionId);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const rejectSubmission = async (submissionId, reason) => {
    setLoading(true);
    setError(null);
    try {
      const response = await managerSubmissionService.rejectSubmission(submissionId, reason);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const markForRegrading = async (submissionId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await managerSubmissionService.markForRegrading(submissionId);
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
    getSubmissionsByExam,
    getSubmissionById,
    getExtractedSubmissions,
    assignSubmissions,
    approveSubmission,
    rejectSubmission,
    markForRegrading,
  };
};
