import api from "./api";

// Fetch aggregate dashboard statistics
const getStats = async () => {
  const res = await api.get("/dashboard/stats");
  return res.data;
};

const dashboardService = { getStats };

export default dashboardService;
