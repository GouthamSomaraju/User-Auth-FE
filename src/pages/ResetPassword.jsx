import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  let {backendUrl}=useContext(AppContent)
  axios.defaults.withCredentials=true
  let navigate = useNavigate();
  let [email,setEmail]=useState('')
  let [newPassword, setnewPassword]=useState('')
  let [isEmailSent,setIsEmailSent]=useState('')
  let [otp,setOtp]=useState(0)
  let [isOtpSubmitted,setIsOtpSubmitted]=useState(false)


    
    let inputRefs=React.useRef([])
  
    let handleInput=(e,index)=>{
      if(e.target.value.length>0 && index<inputRefs.current.length-1){
        inputRefs.current[index+1].focus()
      }
    }
    let handleKeyDown=(e,index)=>{
      if(e.key==='Backspace' && e.target.value===''&& index>0){
        inputRefs.current[index-1].focus()
      }
    }
  
    let handlePaste=(e)=>{
      let paste=e.clipboardData.getData('text')
      let pasteArray=paste.split('')
      pasteArray.forEach((char,index)=>{
        if(inputRefs.current[index]){
          inputRefs.current[index].value=char
        }
      })
    }

    let onSubmitEmail=async(e)=>{
      e.preventDefault()
      try {
        let {data}=await axios.post(backendUrl+'/api/auth/send-reset-otp',{email})
        data.success?toast.success(data.message):toast.error(data.message)
        data.success && setIsEmailSent(true)
      } catch (error) {
        toast.error(error.message)
      }
    }

    let onSubmitOtp=async (e) => {
      e.preventDefault()
      const otpArray=inputRefs.current.map(e=>e.value)
      setOtp(otpArray.join(''))
      setIsOtpSubmitted(true)
      
    }
    let onSubmitNewPassword=async (e) => {
      e.preventDefault()
      try {
        let {data}=await axios.post(backendUrl+'/api/auth/reset-password',{email, otp, newPassword})
        data.success ? toast.success(data.message):toast.error(data.message)
        data.success && navigate('/login')
      } catch (error) {
        toast.error(error.message)
      }
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {/* enter email id */}
      {!isEmailSent &&
      <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset password</h1>
        <p className="text-center mb-6 text-indigo-300">Enter your registered email address</p>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.mail_icon} alt="" />
          <input value={email} onChange={e=>setEmail(e.target.value)} required type="email" placeholder="email id" className="bg-transparent outline-none text-white"/>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">Submit</button>
          
        </div>
        
      </form>
      }

{/* Otp input form */}
{!isOtpSubmitted && isEmailSent &&
     <form onSubmit={onSubmitOtp}  className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset password OTP</h1>
        <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email id.</p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6).fill(0).map((_,index)=>(
            
            <input ref={e=>inputRefs.current[index]=e} onInput={(e)=>handleInput(e, index)} onKeyDown={(e)=>handleKeyDown(e,index)} type="text" maxLength='1' key={index} required className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md" />
          )
        )}
        </div>
        <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">Submit</button>
      </form>
      }

      {/*  enter new password*/}
      {isOtpSubmitted && isEmailSent &&
      <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">New password</h1>
        <p className="text-center mb-6 text-indigo-300">Enter new password below</p>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.lock_icon} alt="" />
          <input value={newPassword} onChange={e=>setnewPassword(e.target.value)} required type="password" placeholder="Password" className="bg-transparent outline-none text-white"/>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">Submit</button>
          
        </div>
        
      </form>
      }
    </div>
    
  );
};

export default ResetPassword;
