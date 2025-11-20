import apiClient from "../../../lib/axios";

const BASE_URL = "/users";

export const examinerService = {
  getExaminers: async () => {
    const response = await apiClient.get(`${BASE_URL}/examiners`);
    return response.data;
  },
};
