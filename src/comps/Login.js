import React, { useState, useRef } from 'react'
import "../styles/Login.css"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const can = useRef(false)
    const errorDis = useRef()
    const navigate = useNavigate()
    function login() {
        if (can.current) {
            if (email.length === 0 || password.length === 0) {
                setError("Please fill all the fields.")
                errorDis.current.style.color = "#ff1f1f"
            }
            axios({
                method: "POST",
                data: {
                    email: email,
                    password: password
                },
                withCredentials: true,
                url: "http://192.168.1.11:4000/login",
            }).then(res => {
                if (res.data === "suc") return navigate("/")
                setError(res.data);
                errorDis.current.style.color = "#ff1f1f"
            }).catch(err => { })
            can.current = false
        }
    }
    return (
        <div className="Login">
            <h1>Login Form</h1>
            <div className="login-form">
                <h5 className="error" ref={errorDis}>{error}</h5>
                <input type="text" placeholder="Enter your email" onChange={(e) => { setEmail(e.target.value) }} required />
                <input type="password" placeholder="Enter your password" onChange={(e) => { setPassword(e.target.value) }} required />
                <div className="btns-cont">
                    <button onClick={() => { can.current = true; login() }}>Login</button>
                    <Link className="link" to="/register"><button>Register</button></Link>
                </div>
            </div>
        </div>
    )
}

export default Login