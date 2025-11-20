import axiosClient from '../../../lib/axios';

export const gradedSubmissionsService = {
  // Get all graded submissions with OData support
  getAllGradedSubmissions: async (odataParams = {}) => {
    try {
      // Build OData query string
      const queryParams = new URLSearchParams();
      
      // $filter - Filter submissions
      if (odataParams.$filter) {
        queryParams.append('$filter', odataParams.$filter);
      }
      
      // $orderby - Sort results
      if (odataParams.$orderby) {
        queryParams.append('$orderby', odataParams.$orderby);
      }
      
      // $top - Limit number of results
      if (odataParams.$top) {
        queryParams.append('$top', odataParams.$top);
      }
      
      // $skip - Skip number of results (pagination)
      if (odataParams.$skip) {
        queryParams.append('$skip', odataParams.$skip);
      }
      
      // $select - Select specific fields
      if (odataParams.$select) {
        queryParams.append('$select', odataParams.$select);
      }
      
      // $expand - Expand related entities
      if (odataParams.$expand) {
        queryParams.append('$expand', odataParams.$expand);
      }
      
      // $count - Include total count
      if (odataParams.$count) {
        queryParams.append('$count', 'true');
      }
      
      const queryString = queryParams.toString();
      const url = `/grading/odata/GradedSubmissions${queryString ? '?' + queryString : ''}`;
      
      const response = await axiosClient.get(url);
      // API returns array directly, not OData wrapper
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get graded submissions by exam ID
  getGradedSubmissionsByExamId: async (examId, odataParams = {}) => {
    try {
      const filterParam = `examId eq ${examId}`;
      const params = {
        ...odataParams,
        $filter: odataParams.$filter 
          ? `${odataParams.$filter} and ${filterParam}` 
          : filterParam
      };
      
      return await gradedSubmissionsService.getAllGradedSubmissions(params);
    } catch (error) {
      throw error;
    }
  },

  // Get graded submissions by student ID
  getGradedSubmissionsByStudentId: async (studentId, odataParams = {}) => {
    try {
      const filterParam = `studentId eq ${studentId}`;
      const params = {
        ...odataParams,
        $filter: odataParams.$filter 
          ? `${odataParams.$filter} and ${filterParam}` 
          : filterParam
      };
      
      return await gradedSubmissionsService.getAllGradedSubmissions(params);
    } catch (error) {
      throw error;
    }
  },

  // Get graded submissions by examiner ID
  getGradedSubmissionsByExaminerId: async (examinerId, odataParams = {}) => {
    try {
      const filterParam = `assignedExaminerId eq ${examinerId}`;
      const params = {
        ...odataParams,
        $filter: odataParams.$filter 
          ? `${odataParams.$filter} and ${filterParam}` 
          : filterParam
      };
      
      return await gradedSubmissionsService.getAllGradedSubmissions(params);
    } catch (error) {
      throw error;
    }
  },

  // Get graded submissions with pagination
  getGradedSubmissionsPaginated: async (page = 1, pageSize = 20, odataParams = {}) => {
    try {
      const params = {
        ...odataParams,
        $top: pageSize,
        $skip: (page - 1) * pageSize,
        $count: true
      };
      
      return await gradedSubmissionsService.getAllGradedSubmissions(params);
    } catch (error) {
      throw error;
    }
  },

  // Search graded submissions by student name or code
  searchGradedSubmissions: async (searchTerm, odataParams = {}) => {
    try {
      const filterParam = `contains(tolower(studentName), '${searchTerm.toLowerCase()}') or contains(tolower(studentCode), '${searchTerm.toLowerCase()}')`;
      const params = {
        ...odataParams,
        $filter: odataParams.$filter 
          ? `${odataParams.$filter} and (${filterParam})` 
          : filterParam
      };
      
      return await gradedSubmissionsService.getAllGradedSubmissions(params);
    } catch (error) {
      throw error;
    }
  },

  // Get graded submissions by date range
  getGradedSubmissionsByDateRange: async (startDate, endDate, odataParams = {}) => {
    try {
      const filterParam = `updatedAt ge ${startDate} and updatedAt le ${endDate}`;
      const params = {
        ...odataParams,
        $filter: odataParams.$filter 
          ? `${odataParams.$filter} and ${filterParam}` 
          : filterParam
      };
      
      return await gradedSubmissionsService.getAllGradedSubmissions(params);
    } catch (error) {
      throw error;
    }
  }
};
