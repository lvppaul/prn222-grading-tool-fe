import { useState, useCallback } from "react";
import exportScoreService from "../services/exportScoreService";
import { message } from "antd";

/**
 * Custom hook for exporting exam scores
 */
export const useExportScore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exportingExamId, setExportingExamId] = useState(null);

  /**
   * Export score file as blob
   * @param {number} examId - The exam ID
   * @returns {Promise<Blob>}
   */
  const exportScore = useCallback(async (examId) => {
    setLoading(true);
    setError(null);
    setExportingExamId(examId);

    try {
      const blob = await exportScoreService.exportScore(examId);
      return blob;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to export scores";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
      setExportingExamId(null);
    }
  }, []);

  /**
   * Export score and automatically download
   * @param {number} examId - The exam ID
   * @param {string} filename - Optional custom filename
   * @returns {Promise<string>} - Downloaded filename
   */
  const exportScoreAndDownload = useCallback(async (examId, filename = null) => {
    setLoading(true);
    setError(null);
    setExportingExamId(examId);

    try {
      message.loading({ content: "Exporting scores...", key: "export" });
      
      const downloadedFilename = await exportScoreService.exportScoreAndDownload(
        examId,
        filename
      );

      message.success({
        content: `Scores exported successfully: ${downloadedFilename}`,
        key: "export",
        duration: 3,
      });

      return downloadedFilename;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to export scores";
      setError(errorMessage);
      
      message.error({
        content: errorMessage,
        key: "export",
        duration: 3,
      });

      throw err;
    } finally {
      setLoading(false);
      setExportingExamId(null);
    }
  }, []);

  /**
   * Export scores for multiple exams
   * @param {number[]} examIds - Array of exam IDs
   * @returns {Promise<string[]>} - Array of downloaded filenames
   */
  const exportMultipleScores = useCallback(async (examIds) => {
    setLoading(true);
    setError(null);

    const results = [];
    const errors = [];

    try {
      message.loading({
        content: `Exporting scores for ${examIds.length} exams...`,
        key: "export-multiple",
      });

      for (const examId of examIds) {
        setExportingExamId(examId);
        try {
          const filename = await exportScoreService.exportScoreAndDownload(examId);
          results.push(filename);
        } catch (err) {
          errors.push({ examId, error: err.message });
        }
      }

      if (errors.length === 0) {
        message.success({
          content: `All ${examIds.length} exam scores exported successfully!`,
          key: "export-multiple",
          duration: 3,
        });
      } else if (results.length > 0) {
        message.warning({
          content: `${results.length} exported, ${errors.length} failed`,
          key: "export-multiple",
          duration: 4,
        });
      } else {
        message.error({
          content: "All exports failed",
          key: "export-multiple",
          duration: 3,
        });
      }

      return results;
    } catch (err) {
      const errorMessage = "Failed to export multiple scores";
      setError(errorMessage);
      
      message.error({
        content: errorMessage,
        key: "export-multiple",
        duration: 3,
      });

      throw err;
    } finally {
      setLoading(false);
      setExportingExamId(null);
    }
  }, []);

  /**
   * Check if specific exam is currently exporting
   * @param {number} examId - The exam ID to check
   * @returns {boolean}
   */
  const isExporting = useCallback(
    (examId) => {
      return exportingExamId === examId;
    },
    [exportingExamId]
  );

  return {
    loading,
    error,
    exportingExamId,
    exportScore,
    exportScoreAndDownload,
    exportMultipleScores,
    isExporting,
  };
};

export default useExportScore;
