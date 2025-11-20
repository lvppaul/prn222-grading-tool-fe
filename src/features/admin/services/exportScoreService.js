import axiosClient from "../../../lib/axios";

/**
 * Service for exporting exam scores
 */
const exportScoreService = {
  /**
   * Export scores for a specific exam
   * @param {number} examId - The exam ID
   * @returns {Promise<Blob>} - The file blob
   */
  exportScore: async (examId) => {
    try {
      const response = await axiosClient.post(
        `/submissions/${examId}/export-score`,
        {},
        {
          responseType: "blob", // Important for file downloads
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error exporting score:", error);
      throw error;
    }
  },

  /**
   * Export scores and trigger download
   * @param {number} examId - The exam ID
   * @param {string} filename - Optional custom filename
   * @returns {Promise<void>}
   */
  exportScoreAndDownload: async (examId, filename = null) => {
    try {
      const response = await axiosClient.post(
        `/submissions/${examId}/export-score`,
        {},
        {
          responseType: "blob",
        }
      );

      console.log("Response headers:", response.headers);
      console.log("Response data type:", response.data.constructor.name);
      console.log("Response data size:", response.data.size);

      // Get filename from Content-Disposition header or use default
      let downloadFilename = filename;
      if (!downloadFilename) {
        const contentDisposition = response.headers["content-disposition"];
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch && filenameMatch[1]) {
            downloadFilename = filenameMatch[1].replace(/['"]/g, "");
          }
        }
      }
      
      // Default filename if none found
      if (!downloadFilename) {
        downloadFilename = `exam_${examId}_scores.xlsx`;
      }

      // Check if response is actually a blob
      if (!(response.data instanceof Blob)) {
        console.error("Response is not a Blob:", response.data);
        throw new Error("Invalid response format - expected Blob");
      }

      // Create blob URL and trigger download
      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      
      console.log("Created blob size:", blob.size);
      console.log("Blob type:", blob.type);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", downloadFilename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      return downloadFilename;
    } catch (error) {
      console.error("Error exporting and downloading score:", error);
      console.error("Error response:", error.response);
      throw error;
    }
  },
};

export default exportScoreService;
