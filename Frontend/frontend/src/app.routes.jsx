import { createHashRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/register"; 
import Landing from "./features/auth/pages/Landing";
import Protected from "./features/auth/components/protected";
import InterviewHome from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/interview";

export const router = createHashRouter([
 {
     path:"/",
     element:<Landing/>
 },
 {
     path:"/login",
     element:<Login/>
 },
 {
   path:"/register",
    element:<Register/>                                             
 },
 {
   path:"/interview-home",
    element:<Protected><InterviewHome /></Protected>                                           
 },
 {
  path:"/interview/:interviewId",
  element:<Protected><Interview/></Protected>
 }
])