import React, { useState, useEffect, useRef } from 'react'
import "../styles/Register.css"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
const ipAddress = process.env.REACT_APP_IP

function Register() {
  const errorDis = useRef()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rPassword, setRPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const can = useRef(false)
    useEffect(() => {
        can.current = true
        async function getData() {
          try {
            let res = await axios({
              url: `http://${ipAddress}:4000/user`,
              method: 'GET',
              withCredentials: true,
            })
            if (res.status === 200) {
              if (res.data !== "") return navigate("/")
            }
          }
          catch (err) {
            //! This is optional.
            console.error(err);
          }
        }
        getData()
      },[navigate])
  function register() {
    if (can.current) {
        setError("");
        setTimeout(() => {
            if (username.length === 0 || email.length === 0 || password.length === 0 || rPassword.length === 0) {
                setError("You must fill all fields.")
                return errorDis.current.style.color = "#ff1f1f"
            }
            if (username.length < 4) {
                setError("Username must be at least 4 characters.")
                return errorDis.current.style.color = "#ff1f1f"
            }
            if (username.length > 12) {
                setError("Username must be between 4 and 12 characters.")
                return errorDis.current.style.color = "#ff1f1f"
            }
            if (email.length === 0) {
                setError("You must enter your email address.")
                return errorDis.current.style.color = "#ff1f1f"
            }
            if (password.length < 8) {
                setError("Password must be at least 8 characters.")
                return errorDis.current.style.color = "#ff1f1f"
            }
            if (password.length > 24) {
                setError("Password must be between 8 and 24 characters.")
                return errorDis.current.style.color = "#ff1f1f"
            }
            if (password !== rPassword) {
                setError("Passwords does not match.")
                return errorDis.current.style.color = "#ff1f1f"
            }
            axios({
                method: "POST",
                data: {
                    username: username,
                    email: email,
                    password: password,
                    rPassword: rPassword,
                },
                withCredentials: true,
                url: `http://${ipAddress}:4000/register`,
            }).then(res => {
                if (res.data === "toHome") {
                    errorDis.current.style.color = "#00be00"
                    setError("Register success!")
                    setTimeout(() => {
                        navigate("/login")
                    }, 2000)
                } else {
                    setError(res.data);
                    errorDis.current.style.color = "#ff1f1f"
                }
            }).catch(err => { })
            can.current = false
        }, 325)
    }
  }
  return (
    <div className="Register">
        <h1>Register Form</h1>
         <div className="register-form">
            <h5 className="error" ref={errorDis}>{error}</h5>
            <input type="text" name="username" placeholder='Enter your username' onChange={(e) => {setUsername(e.target.value)}} required />
            <input type="text" name="email" placeholder = "Enter your email" onChange={(e) => {setEmail(e.target.value)}} required />
            <input type ="password" name="password" placeholder="Enter your password" onChange={(e) => {setPassword(e.target.value)}} required />
            <input type ="password" name="rpassword" placeholder="Repeat your password" onChange={(e) => {setRPassword(e.target.value)}} required />
            <div className="btns-cont">
                <button onClick={() => {can.current = true; register()}}>Register</button>
                <Link className="link" to="/login"><button>Login</button></Link>
            </div>
        </div>
    </div>
  )
}

export default Register