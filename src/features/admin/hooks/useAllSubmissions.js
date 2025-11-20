import { useState, useCallback } from 'react';
import { allSubmissionsService } from '../services/allSubmissionsService';

export const useAllSubmissions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // Get all submissions
  const getAllSubmissions = useCallback(async (odataParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await allSubmissionsService.getAllSubmissions(odataParams);
      
      // Handle OData response format
      if (response['@odata.count'] !== undefined) {
        setTotalCount(response['@odata.count']);
        setSubmissions(response.value || response);
      } else {
        setSubmissions(Array.isArray(response) ? response : []);
        setTotalCount(Array.isArray(response) ? response.length : 0);
      }
      
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  // Get submissions by status
  const getSubmissionsByStatus = useCallback(async (status, odataParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await allSubmissionsService.getSubmissionsByStatus(status, odataParams);
      
      if (response['@odata.count'] !== undefined) {
        setTotalCount(response['@odata.count']);
        setSubmissions(response.value || response);
      } else {
        setSubmissions(Array.isArray(response) ? response : []);
        setTotalCount(Array.isArray(response) ? response.length : 0);
      }
      
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  // Get submissions by exam ID
  const getSubmissionsByExamId = useCallback(async (examId, odataParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await allSubmissionsService.getSubmissionsByExamId(examId, odataParams);
      
      if (response['@odata.count'] !== undefined) {
        setTotalCount(response['@odata.count']);
        setSubmissions(response.value || response);
      } else {
        setSubmissions(Array.isArray(response) ? response : []);
        setTotalCount(Array.isArray(response) ? response.length : 0);
      }
      
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  // Get submissions by student ID
  const getSubmissionsByStudentId = useCallback(async (studentId, odataParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await allSubmissionsService.getSubmissionsByStudentId(studentId, odataParams);
      
      if (response['@odata.count'] !== undefined) {
        setTotalCount(response['@odata.count']);
        setSubmissions(response.value || response);
      } else {
        setSubmissions(Array.isArray(response) ? response : []);
        setTotalCount(Array.isArray(response) ? response.length : 0);
      }
      
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  // Get submissions with pagination
  const getSubmissionsPaginated = useCallback(async (page = 1, pageSize = 20, odataParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await allSubmissionsService.getSubmissionsPaginated(page, pageSize, odataParams);
      
      if (response['@odata.count'] !== undefined) {
        setTotalCount(response['@odata.count']);
        setSubmissions(response.value || response);
      } else {
        setSubmissions(Array.isArray(response) ? response : []);
        setTotalCount(Array.isArray(response) ? response.length : 0);
      }
      
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  // Search submissions
  const searchSubmissions = useCallback(async (searchTerm, odataParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await allSubmissionsService.searchSubmissions(searchTerm, odataParams);
      
      if (response['@odata.count'] !== undefined) {
        setTotalCount(response['@odata.count']);
        setSubmissions(response.value || response);
      } else {
        setSubmissions(Array.isArray(response) ? response : []);
        setTotalCount(Array.isArray(response) ? response.length : 0);
      }
      
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  // Clear submissions
  const clearSubmissions = useCallback(() => {
    setSubmissions([]);
    setTotalCount(0);
    setError(null);
  }, []);

  return {
    loading,
    error,
    submissions,
    totalCount,
    getAllSubmissions,
    getSubmissionsByStatus,
    getSubmissionsByExamId,
    getSubmissionsByStudentId,
    getSubmissionsPaginated,
    searchSubmissions,
    clearSubmissions
  };
};
