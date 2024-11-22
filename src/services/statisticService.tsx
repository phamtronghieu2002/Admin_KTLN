import axios from "./axiosInstance"

// lấy danh sách category theo group (skills, prepare, practices)
export const getStatistic = async () => {
  return axios.get(`/statistic`)
}
