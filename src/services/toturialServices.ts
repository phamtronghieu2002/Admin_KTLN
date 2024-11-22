import axios from "./axiosInstance"

export const addToturial = (data:{
    contents:string,
    cate_id:string
})=>{
        return axios.post("/toturial",data)
}


export const getTotural = (cate_id:string)=>{
    return axios.get(`/toturial?cate_id=${cate_id}`)
}
