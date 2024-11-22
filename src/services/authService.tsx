import axios from "./axiosInstance"

// lấy danh sách category theo group (skills, prepare, practices)
export const login = async (data:any) => {
  return axios.post(`/account/login`,data)
}
