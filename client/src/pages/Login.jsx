import React from 'react'
import { useState } from 'react';
import axios from 'axios'

function Login() {

  const [aadhar,setAadhar]= useState("");
  const [password,setPassword]=useState("");

const handleSubmit=()=>{
  const payload = {
    aadharCardNumber:aadhar,
    password:password
  }
  console.log("output",payload)

  axios.post(`${import.meta.env.VITE_API_URL}/user/login`,payload)
  .then((res)=>{
    localStorage.setItem("token",JSON.stringify(res.data.token))
    alert('Login Successful')
    setAadhar("")
    setPassword("")
    console.log('Login Successful',res);
  })
  .catch((err)=>{
    alert('Login Failed')
    console.log("Login Failed",err);
  })
}
  return (
    <div>
      <h1>Login Page</h1>
      <input
  type="text"
  value={aadhar}
  onChange={(e) => setAadhar(e.target.value)}
  placeholder="Aadhar Number"
/>

<input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Password"
/>

      <button onClick={handleSubmit}>Login</button>
    </div>


  )
}

export default Login