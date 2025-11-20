import { useState, useCallback } from 'react';
import { gradedSubmissionsService } from '../services/gradedSubmissionsService';

export const useGradedSubmissions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gradedSubmissions, setGradedSubmissions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // Get all graded submissions
  const getAllGradedSubmissions = useCallback(async (odataParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await gradedSubmissionsService.getAllGradedSubmissions(odataParams);
      
      // Handle OData response format
      if (response['@odata.count'] !== undefined) {
        setTotalCount(response['@odata.count']);
        setGradedSubmissions(response.value || response);
      } else {
        setGradedSubmissions(Array.isArray(response) ? response : []);
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

  // Get graded submissions by exam ID
  const getGradedSubmissionsByExamId = useCallback(async (examId, odataParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await gradedSubmissionsService.getGradedSubmissionsByExamId(examId, odataParams);
      
      if (response['@odata.count'] !== undefined) {
        setTotalCount(response['@odata.count']);
        setGradedSubmissions(response.value || response);
      } else {
        setGradedSubmissions(Array.isArray(response) ? response : []);
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

  // Get graded submissions by student ID
  const getGradedSubmissionsByStudentId = useCallback(async (studentId, odataParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await gradedSubmissionsService.getGradedSubmissionsByStudentId(studentId, odataParams);
      
      if (response['@odata.count'] !== undefined) {
        setTotalCount(response['@odata.count']);
        setGradedSubmissions(response.value || response);
      } else {
        setGradedSubmissions(Array.isArray(response) ? response : []);
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

  // Get graded submissions by examiner ID
  const getGradedSubmissionsByExaminerId = useCallback(async (examinerId, odataParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await gradedSubmissionsService.getGradedSubmissionsByExaminerId(examinerId, odataParams);
      
      if (response['@odata.count'] !== undefined) {
        setTotalCount(response['@odata.count']);
        setGradedSubmissions(response.value || response);
      } else {
        setGradedSubmissions(Array.isArray(response) ? response : []);
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

  // Get graded submissions with pagination
  const getGradedSubmissionsPaginated = useCallback(async (page = 1, pageSize = 20, odataParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await gradedSubmissionsService.getGradedSubmissionsPaginated(page, pageSize, odataParams);
      
      if (response['@odata.count'] !== undefined) {
        setTotalCount(response['@odata.count']);
        setGradedSubmissions(response.value || response);
      } else {
        setGradedSubmissions(Array.isArray(response) ? response : []);
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

  // Search graded submissions
  const searchGradedSubmissions = useCallback(async (searchTerm, odataParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await gradedSubmissionsService.searchGradedSubmissions(searchTerm, odataParams);
      
      if (response['@odata.count'] !== undefined) {
        setTotalCount(response['@odata.count']);
        setGradedSubmissions(response.value || response);
      } else {
        setGradedSubmissions(Array.isArray(response) ? response : []);
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

  // Get graded submissions by date range
  const getGradedSubmissionsByDateRange = useCallback(async (startDate, endDate, odataParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await gradedSubmissionsService.getGradedSubmissionsByDateRange(startDate, endDate, odataParams);
      
      if (response['@odata.count'] !== undefined) {
        setTotalCount(response['@odata.count']);
        setGradedSubmissions(response.value || response);
      } else {
        setGradedSubmissions(Array.isArray(response) ? response : []);
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

  // Clear graded submissions
  const clearGradedSubmissions = useCallback(() => {
    setGradedSubmissions([]);
    setTotalCount(0);
    setError(null);
  }, []);

  return {
    loading,
    error,
    gradedSubmissions,
    totalCount,
    getAllGradedSubmissions,
    getGradedSubmissionsByExamId,
    getGradedSubmissionsByStudentId,
    getGradedSubmissionsByExaminerId,
    getGradedSubmissionsPaginated,
    searchGradedSubmissions,
    getGradedSubmissionsByDateRange,
    clearGradedSubmissions
  };
};
