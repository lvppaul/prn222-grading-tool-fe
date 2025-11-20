/**
 * USAGE EXAMPLES for useAllSubmissions Hook
 * 
 * This file demonstrates how to use the useAllSubmissions hook with OData parameters
 */

import { useEffect } from 'react';
import { useAllSubmissions } from './useAllSubmissions';

// Example 1: Get all submissions
export const Example1_GetAll = () => {
  const { loading, error, submissions, totalCount, getAllSubmissions } = useAllSubmissions();

  useEffect(() => {
    getAllSubmissions();
  }, [getAllSubmissions]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <p>Total: {totalCount}</p>
      <ul>
        {submissions.map(sub => (
          <li key={sub.id}>{sub.studentName} - {sub.status}</li>
        ))}
      </ul>
    </div>
  );
};

// Example 2: Get submissions with pagination
export const Example2_Pagination = () => {
  const { loading, submissions, totalCount, getSubmissionsPaginated } = useAllSubmissions();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    getSubmissionsPaginated(page, pageSize);
  }, [page, getSubmissionsPaginated]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      <p>Showing {submissions.length} of {totalCount} submissions</p>
      
      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
        Previous
      </button>
      <span> Page {page} </span>
      <button onClick={() => setPage(p => p + 1)} disabled={submissions.length < pageSize}>
        Next
      </button>
    </div>
  );
};

// Example 3: Filter by status
export const Example3_FilterByStatus = () => {
  const { loading, submissions, getSubmissionsByStatus } = useAllSubmissions();
  const [status, setStatus] = useState('Pending');

  useEffect(() => {
    getSubmissionsByStatus(status);
  }, [status, getSubmissionsByStatus]);

  return (
    <div>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Pending">Pending</option>
        <option value="Extracted">Extracted</option>
        <option value="Graded">Graded</option>
      </select>
      
      {loading ? <p>Loading...</p> : (
        <ul>
          {submissions.map(sub => (
            <li key={sub.id}>{sub.studentName} - {sub.studentCode}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Example 4: Filter by exam ID
export const Example4_FilterByExam = () => {
  const { loading, submissions, getSubmissionsByExamId } = useAllSubmissions();
  const examId = 4;

  useEffect(() => {
    getSubmissionsByExamId(examId);
  }, [examId, getSubmissionsByExamId]);

  return (
    <div>
      <h3>Submissions for Exam {examId}</h3>
      {loading ? <p>Loading...</p> : (
        <ul>
          {submissions.map(sub => (
            <li key={sub.id}>
              {sub.studentName} ({sub.studentCode}) - {sub.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Example 5: Search submissions
export const Example5_Search = () => {
  const { loading, submissions, searchSubmissions } = useAllSubmissions();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchSubmissions(searchTerm);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name or code..."
      />
      <button onClick={handleSearch}>Search</button>
      
      {loading ? <p>Loading...</p> : (
        <ul>
          {submissions.map(sub => (
            <li key={sub.id}>
              {sub.studentName} ({sub.studentCode})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Example 6: Advanced OData query with multiple filters
export const Example6_AdvancedFilters = () => {
  const { loading, submissions, totalCount, getAllSubmissions } = useAllSubmissions();

  useEffect(() => {
    // Get submissions for exam 4 with status "Pending", ordered by student name
    getAllSubmissions({
      $filter: "examId eq 4 and status eq 'Pending'",
      $orderby: 'studentName asc',
      $top: 10,
      $count: true
    });
  }, [getAllSubmissions]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      <p>Found {totalCount} pending submissions</p>
      <ul>
        {submissions.map(sub => (
          <li key={sub.id}>{sub.studentName} - {sub.studentCode}</li>
        ))}
      </ul>
    </div>
  );
};

// Example 7: Select specific fields only
export const Example7_SelectFields = () => {
  const { loading, submissions, getAllSubmissions } = useAllSubmissions();

  useEffect(() => {
    // Only fetch id, studentName, and status fields
    getAllSubmissions({
      $select: 'id,studentName,studentCode,status',
      $orderby: 'studentName asc'
    });
  }, [getAllSubmissions]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      <ul>
        {submissions.map(sub => (
          <li key={sub.id}>
            {sub.studentName} ({sub.studentCode}) - {sub.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Example 8: Combined filters with pagination and sorting
export const Example8_CompleteExample = () => {
  const { 
    loading, 
    error,
    submissions, 
    totalCount, 
    getAllSubmissions 
  } = useAllSubmissions();
  
  const [filters, setFilters] = useState({
    status: 'Pending',
    examId: 4,
    page: 1,
    pageSize: 20,
    sortBy: 'studentName',
    sortDirection: 'asc'
  });

  useEffect(() => {
    const odataParams = {
      $filter: `examId eq ${filters.examId} and status eq '${filters.status}'`,
      $orderby: `${filters.sortBy} ${filters.sortDirection}`,
      $top: filters.pageSize,
      $skip: (filters.page - 1) * filters.pageSize,
      $count: true
    };

    getAllSubmissions(odataParams);
  }, [filters, getAllSubmissions]);

  const totalPages = Math.ceil(totalCount / filters.pageSize);

  return (
    <div>
      {/* Filters */}
      <div>
        <select 
          value={filters.status} 
          onChange={(e) => setFilters({...filters, status: e.target.value, page: 1})}
        >
          <option value="Pending">Pending</option>
          <option value="Extracted">Extracted</option>
          <option value="Graded">Graded</option>
        </select>

        <select 
          value={filters.sortBy} 
          onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
        >
          <option value="studentName">Student Name</option>
          <option value="studentCode">Student Code</option>
          <option value="createdAt">Created Date</option>
          <option value="status">Status</option>
        </select>

        <button 
          onClick={() => setFilters({
            ...filters, 
            sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc'
          })}
        >
          {filters.sortDirection === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {/* Results */}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      
      <p>Showing {submissions.length} of {totalCount} submissions</p>
      
      <table>
        <thead>
          <tr>
            <th>Student Code</th>
            <th>Student Name</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map(sub => (
            <tr key={sub.id}>
              <td>{sub.studentCode}</td>
              <td>{sub.studentName}</td>
              <td>{sub.status}</td>
              <td>{new Date(sub.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button 
          onClick={() => setFilters({...filters, page: filters.page - 1})}
          disabled={filters.page === 1 || loading}
        >
          Previous
        </button>
        
        <span> Page {filters.page} of {totalPages} </span>
        
        <button 
          onClick={() => setFilters({...filters, page: filters.page + 1})}
          disabled={filters.page >= totalPages || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
};
