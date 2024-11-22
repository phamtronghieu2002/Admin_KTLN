import axios from "./axiosInstance"

export const getvocByTestId = async (test_id: string,keyword:string="") => {
  return axios.get(`/voc/test/${test_id}?keyword=${keyword}`)
}
// thêm vocs
export const createVoc = async (data: any) => {
  return axios.post("/voc", data)
}


export const updateVoc = async (voc_id:string,data: any) => {
  return axios.put(`/voc/${voc_id}`, data)
}

export const deleteVoc = async (id: string) => {
  return axios.delete(`/voc/${id}`)
} 