import { useState, useEffect } from "react";
import { examinerService } from "../services/examinerService";
import { message } from "antd";

export const useExaminer = () => {
  const [examiners, setExaminers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExaminers = async () => {
    setLoading(true);
    try {
      const response = await examinerService.getExaminers();
      console.log("Examiner API Response:", response);
      const examinersData = response.payload || response.Payload || [];
      console.log("Examiners Data:", examinersData);
      setExaminers(examinersData);
    } catch (error) {
      message.error("Failed to load examiners");
      console.error("Error fetching examiners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExaminers();
  }, []);

  return {
    examiners,
    loading,
    refetchExaminers: fetchExaminers,
  };
};
