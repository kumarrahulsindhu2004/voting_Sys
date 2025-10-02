import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    mobile: "",
    address: "",
    aadhar: "",
    password: "",
    role: "voter", // default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const payload = {
      name: formData.name,
      age: formData.age,
      email: formData.email,
      mobile: formData.mobile,
      address: formData.address,
      aadharCardNumber: formData.aadhar,
      password: formData.password,
      role: formData.role,
    };

    console.log("Signup Payload:", payload);

    axios
      .post(`${import.meta.env.VITE_API_URL}/user/signup`, payload)
      .then((res) => {
        alert("Signup Successful 🎉");
        console.log("Signup Response:", res.data);

        // Reset all fields at once
        setFormData({
          name: "",
          age: "",
          email: "",
          mobile: "",
          address: "",
          aadhar: "",
          password: "",
          role: "voter",
        });
      })
      .catch((err) => {
        alert("Signup Failed ❌");
        console.error("Signup Error:", err.response?.data || err.message);
      });
  };

  return (
    <div>
      <h1>Signup Page</h1>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full Name"
      />

      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />

      <input
        type="number"
        name="mobile"
        value={formData.mobile}
        onChange={handleChange}
        placeholder="Mobile Number"
      />

      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
      />

      <input
        type="text"
        name="aadhar"
        value={formData.aadhar}
        onChange={handleChange}
        placeholder="Aadhar Number"
      />

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />

      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="voter">Voter</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={handleSubmit}>Signup</button>
    </div>
  );
}

export default Signup;
