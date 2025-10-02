import React, { useEffect, useState } from 'react'
import axios from 'axios'
function Profile() {

const [userProfile,setUserProfile]=useState("")
useEffect(()=>{
  const token = JSON.parse(localStorage.getItem('token'))
  const header={
    headers:{
      Authorization:`Bearer ${token}`
    }
  }
  axios.get(`${import.meta.env.VITE_API_URL}/user/profile`,header)
  .then((res)=>{
    setUserProfile(res.data.user)
    console.log("profile data",res);
  })
  .catch((err)=>{
    console.log("Error occured",err);
    
  })
  
},[])

  return (
     <div>
      <h1>Profile</h1>
      {userProfile ? (
        <div>
          <p>Name : {userProfile.name}</p>
          <p>Email : {userProfile.email}</p>
          <p>Aadhar : {userProfile.aadharCardNumber}</p>
          <p>Age : {userProfile.age}</p>
          <p>Role : {userProfile.role}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>

  )
}

export default Profile