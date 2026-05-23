import axios from "axios";

const api = axios.create({
   baseURL:"https://resume-analyzer-pisb.onrender.com",
   withCredentials:true,
})

export const generateInterviewReport = async ({jobDescription, resumeFile, selfDescription})=>{
   const formData = new FormData();               
   formData.append("jobDescription", jobDescription)                                                                                                   
   formData.append("resume", resumeFile)                                                                                                         
   formData.append("selfDescription", selfDescription)                                                                                                 

   const response = await api.post("/api/interview/", formData, {
    headers:{
        "Content-Type":"multipart/form-data"
    }
   })
   return response.data
}   

export const getInterviewReportById = async (interviewId)=>{
   const response = await api.get(`/api/interview/report/${interviewId}`)
   return response.data
}

export const getAllInterviewReport = async ()=>{
   const response = await api.get("/api/interview/")
   return response.data
}

/**
 * @description this function will call the backend api to generate a resume pdf using ai for the given interview report id. The backend will return the pdf file as a blob which will be downloaded by the frontend. 
 */

export const generateResumePdf = async ({interviewId})=>{
   const response = await api.post(`/api/interview/resume/pdf/${interviewId}`,null,{
    responseType:"blob"
   })
   return response.data
}