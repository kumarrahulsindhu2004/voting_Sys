import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Candidates() {
  const [candidates, setCandidates] = useState([])

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'))
    const header = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    axios.get(`${import.meta.env.VITE_API_URL}/candidate`, header)
      .then((res) => {
        setCandidates(res.data)   // res.data is an array
        console.log("Candidate Data", res.data)
      })
      .catch((err) => {
        console.log("Error occured", err)
      })
  }, [])

  return (
    <div>
      <h2>Candidates</h2>
      <ul>
        {candidates.map((item, index) => (
          <li key={index}>
            Party: {item.party} | Count: {item.count}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Candidates
