import axios from "./axiosInstance"

// lấy danh sách lesson theo category
export const getLessonByCategory = async (category: any, keyword: string) => {
  return axios.get(`/lesson/category/${category}?keyword=${keyword}`)
}
// lấy lesson theo id
export const getLessonById = async (id: string) => {
  return axios.get(`/lesson/${id}`)
}

//thêm lesson
export const addLesson = async (data: {
  name_lesson: string
  cate_id: string
}) => {
  return axios.post("/lesson", data)
}

//sửa lesson
export const updateLesson = async (data: {
  id: string
  name_lesson: string
}) => {
  return axios.put(`/lesson/${data.id}`, data)
}

//xóa lesson
export const deleteLesson = async (id: string) => {
  return axios.delete(`/lesson/${id}`)
}
