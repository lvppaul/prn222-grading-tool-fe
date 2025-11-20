import { useState } from 'react';
import { examService } from '../services/examService';

export const useExam = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createExam = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await examService.createExam(formData);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const getAllExams = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await examService.getAllExams();
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const publishExam = async (examId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await examService.publishExam(examId);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const closeExam = async (examId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await examService.closeExam(examId);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const getAllSemesters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await examService.getAllSemesters();
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
    createExam,
    getAllExams,
    publishExam,
    closeExam,
    getAllSemesters,
  };
};
