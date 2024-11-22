import axios from "./axiosInstance"

// thêm test result
export const addTestResult = async (data: any) => {
  return axios.post("/testResult", data)
}

export const deleteTestResult= async (
  test_id: string,
  question_id: string,
) => {
  return axios.delete(
    `/testResult?test_id=${test_id}&question_id=${question_id}`,
  )
}
