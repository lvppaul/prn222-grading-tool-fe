import axiosClient from '../../../lib/axios';

export const allSubmissionsService = {
  // Get all submissions with OData support
  getAllSubmissions: async (odataParams = {}) => {
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
      const url = `/grading/odata/AllSubmissions${queryString ? '?' + queryString : ''}`;
      
      const response = await axiosClient.get(url);
      // API returns array directly, not OData wrapper
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get submissions by status
  getSubmissionsByStatus: async (status, odataParams = {}) => {
    try {
      const filterParam = `status eq '${status}'`;
      const params = {
        ...odataParams,
        $filter: odataParams.$filter 
          ? `${odataParams.$filter} and ${filterParam}` 
          : filterParam
      };
      
      return await allSubmissionsService.getAllSubmissions(params);
    } catch (error) {
      throw error;
    }
  },

  // Get submissions by exam ID
  getSubmissionsByExamId: async (examId, odataParams = {}) => {
    try {
      const filterParam = `examId eq ${examId}`;
      const params = {
        ...odataParams,
        $filter: odataParams.$filter 
          ? `${odataParams.$filter} and ${filterParam}` 
          : filterParam
      };
      
      return await allSubmissionsService.getAllSubmissions(params);
    } catch (error) {
      throw error;
    }
  },

  // Get submissions by student ID
  getSubmissionsByStudentId: async (studentId, odataParams = {}) => {
    try {
      const filterParam = `studentId eq ${studentId}`;
      const params = {
        ...odataParams,
        $filter: odataParams.$filter 
          ? `${odataParams.$filter} and ${filterParam}` 
          : filterParam
      };
      
      return await allSubmissionsService.getAllSubmissions(params);
    } catch (error) {
      throw error;
    }
  },

  // Get submissions with pagination
  getSubmissionsPaginated: async (page = 1, pageSize = 20, odataParams = {}) => {
    try {
      const params = {
        ...odataParams,
        $top: pageSize,
        $skip: (page - 1) * pageSize,
        $count: true
      };
      
      return await allSubmissionsService.getAllSubmissions(params);
    } catch (error) {
      throw error;
    }
  },

  // Search submissions by student name or code
  searchSubmissions: async (searchTerm, odataParams = {}) => {
    try {
      const filterParam = `contains(tolower(studentName), '${searchTerm.toLowerCase()}') or contains(tolower(studentCode), '${searchTerm.toLowerCase()}')`;
      const params = {
        ...odataParams,
        $filter: odataParams.$filter 
          ? `${odataParams.$filter} and (${filterParam})` 
          : filterParam
      };
      
      return await allSubmissionsService.getAllSubmissions(params);
    } catch (error) {
      throw error;
    }
  }
};
