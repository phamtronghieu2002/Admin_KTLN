import axios from "./axiosInstance"

export const getTips = async (category: string) => {
  return axios.get(`/tip?cate_id=${category}`)
}
// thêm tips
export const createTip = async (data: any) => {
  return axios.post("/tip", data)
}


export const updateTip = async (data: any) => {
  return axios.put("/tip", data)
}

export const deleteTip = async (id: string) => {
  return axios.delete(`/tip/${id}`)
} 