import { useState } from "react";
import studentService from "../services/studentService";

const useStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);

  const getStudentsByExam = async (examId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentService.getStudentsByExam(examId);
      const studentsData = response.payload || response.Payload || [];
      setStudents(studentsData);
      return studentsData;
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.Message || "Failed to fetch students");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentService.createStudent(studentData);
      return response;
    } catch (err) {
      setError(err.response?.data?.Message || "Failed to create student");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (id, studentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentService.updateStudent(id, studentData);
      return response;
    } catch (err) {
      setError(err.response?.data?.Message || "Failed to update student");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentService.deleteStudent(id);
      return response;
    } catch (err) {
      setError(err.response?.data?.Message || "Failed to delete student");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    students,
    getStudentsByExam,
    createStudent,
    updateStudent,
    deleteStudent,
  };
};

export default useStudent;
