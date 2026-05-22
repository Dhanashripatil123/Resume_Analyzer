import { createContext, useState } from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
   const [interviews, setInterviews] = useState(false);
   const [loading, setLoading] = useState(false);
   const [report, setReport] = useState(null);
   const [reports, setReports] = useState([]);

   const value = {
       loading,
       setLoading,
       report,
       setReport,
       reports,
       setReports
   };

   return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>
}

export default InterviewContext;