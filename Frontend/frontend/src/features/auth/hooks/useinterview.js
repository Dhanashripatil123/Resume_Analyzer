import { getAllInterviewReport ,generateInterviewReport,getInterviewReportById,generateResumePdf} from "../../interview/services/interview.api";
import {useContext} from "react";
import { InterviewContext } from "../../interview/interview.context.jsx";
import  {useParams} from "react-router-dom"
import { useEffect } from "react";

export const useInterview = ()=>{
    const context = useContext(InterviewContext)
    const {interviewId} = useParams()

    if(!context){
       throw new Error("useInterview must be used within an InterviewProvider")                                           
    }

    const {loading,setLoading,report,setReport,reports,setReports} = context

    const generateReport = async ({jobDescription,resumeFile,selfDescription})=>{
        setLoading(true)
        try{
          const response = await generateInterviewReport({jobDescription,resumeFile,selfDescription})
          setReport(response.interviewReport)
          return response
        }catch(err){
            console.error("Error generating report:", err);
            throw err
        }finally{
            setLoading(false)
        }                      
    }

    const getReportById = async (interviewId)=>{
        setLoading(true) 
        try{
            const response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
            return response
        }catch(err){
            console.error("Error fetching report:", err);
            throw err
        }finally{
            setLoading(false)
        }                         
    }

    useEffect(()=>{
       if(interviewId){
        getReportById(interviewId)
       }else{
          getReports()                                         
       }                                                                                            
    },[interviewId])                                                 

    const getReports = async ()=>{
        setLoading(true)  
        try{
            const response = await getAllInterviewReport()
            setReports(response.reports)
            return response
        }catch(err){
            console.error("Error fetching all reports:", err);
            throw err
        }finally{
            setLoading(false)
        }                                                                          
    }

     const getResumePdf = async (interviewId)=>{
        setLoading(true)
        let response=null;
        try{
            response = await generateResumePdf({interviewId})
            const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `resume_${interviewId}.pdf`);
            document.body.appendChild(link);
            link.click();
           
        }catch(err){
            console.error("Error generating resume PDF:", err);
            throw err
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
       if(interviewId){
        getReportById(interviewId)
       }else{
          getReports()                                         
       }                                                                                            
    },[interviewId]) 

    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf
    }
}
