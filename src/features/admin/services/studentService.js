import axiosClient from "../../../lib/axios";

const studentService = {
  getStudentsByExam: async (examId) => {
    const response = await axiosClient.get(`/students/exam/${examId}`);
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await axiosClient.get(`/students/${id}`);
    return response.data;
  },

  createStudent: async (studentData) => {
    const response = await axiosClient.post(`/students`, studentData);
    return response.data;
  },

  updateStudent: async (id, studentData) => {
    const response = await axiosClient.put(`/students/${id}`, studentData);
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await axiosClient.delete(`/students/${id}`);
    return response.data;
  },
};

export default studentService;
