import axios from "./axiosInstance"

// lấy danh sách category theo group (skills, prepare, practices)
export const getCategories = async (group: string = "all") => {
  return axios.get(`/category/admin?group=${group}`)
}
