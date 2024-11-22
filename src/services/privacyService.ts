import axios from "./axiosInstance"

export const addPrivacyTerm = async (data: any) => {
  return axios.post("/privacy_term", data)
}

export const getPrivacyTerm = async () => {
     
    return axios.get("/privacy_term")

}