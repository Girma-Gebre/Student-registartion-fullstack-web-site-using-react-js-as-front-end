import React, { useState } from "react";
import "./RegistrationForm.css";

function RegistrationForm() {
  // data input handling
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    course: "",
  });

  //response message hanlding
    const [message, setMessage] = useState({Msg: "", backgroundColor: "", color: "", display: "none"});

  // spinner handling
    const [spinner, setSpinner] = useState("none");

  // input phone number handling
    const [error, setError] = useState("");
    
 // this function ebnable the input to take text from client 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // [name] indicates variable name and "...formData" handling the rest data when we enter the current single data
  };

  const handleSubmit = async(e) => {
    e.preventDefault(); // to prevent the browser deafult action i.e reload while this function called
    setMessage({Msg: "", backgroundColor: "", color: "", display: "none"}); // making the message content empty when re-register
    setSpinner("block") // show spinner
   
       try {
      const phonePattern = /^09\d{8}$/; // regex number must start with 09 and 8 digit after
     // checking phone number validation
      if (!phonePattern.test(formData.phone)) {
          setError("Your phone number must start with 09 and has 10 digit in total")
             return;
        }else{
          setError(""); 
        }
     // use post method to link with the backend
      const URL = "/submit";
      const postMethodObject =  {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData)  // making the data sitring 
      };
        // post the data begin
      const send = await fetch(URL,postMethodObject)
      const data = await send.json();

      if(data.Msg === "You are registered successfully"){
        setMessage({Msg: data.Msg, backgroundColor: "#a1e6b0ff", color: "#0bbe38ff", display: "block"});

      // reset the input
      setFormData({
         fullName: "",
         email: "",
         phone: "",
         course: "",
       });
      } else {
        setMessage({ Msg: data.Msg, backgroundColor: "#eeb7b7ff", color: "#e61919ff", display: "block"});
      }
      
    } catch (error) {
      console.error("Error submitting data:", error);
    }finally{
      setSpinner("none") // hide spinner
    }
  };

  return (
    <div className="registration-form-container">
      <h2>Register Now</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email Address
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Phone Number
          <input
            type="number"
            name="phone"
            placeholder="Enter your phone number e.g 0916......"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>
       {error && <p style={{ color: "red" }}>{error}</p>} {/* checking if the phone number is valid or not*/}
        <label>
          Select Course
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          >
            <option value="">-- Choose a Course --</option>
            <option value="Front-end Web Development">Front-end Web Development</option>
            <option value="Back-end Web development">Back-end Web development</option>
            <option value="Full-stack Web Development">Full-stack Web Development</option>
            <option value="Data Enginner">Data Enginner</option>
            <option value="Data Syntist">Data Syntist</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="AI Analyst">AI Analyst</option>
          </select>
        </label>

        <button type="submit" className="submit-btn">
          Submit Registration
        </button>
      </form>
      <div className="spinner" style={{display: spinner}}></div>
      <p className="success-message" style={{backgroundColor: message.backgroundColor, color: message.color, display: message.display}}>{message.Msg}</p>
    </div>
  );
}

export default RegistrationForm;
