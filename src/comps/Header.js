import React, { useState, useEffect, useRef } from 'react'
import "../styles/Header.css"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

function Head() {
  const [user, setUser] = useState("")
  const can = useRef(false)
  const navigate = useNavigate()
  function logout() {
    if (can.current) {
        axios({
            method: "DELETE",
            withCredentials: true,
            url: "http://192.168.1.11:4000/logout",
        }).then(res => {
            if (res.data === "toLogin") navigate("/login")
        }).catch(err => { })
        can.current = false
    }
}
  useEffect(() => {
    can.current = true
    async function getData() {
      try {
        let res = await axios({
          url: 'http://192.168.1.11:4000/user',
          method: 'GET',
          withCredentials: true,
        })
        if (res.status === 200) {
          if (res.data !== "") return setUser(res.data)
          setUser("")
          navigate("/login")
        }
      }
      catch (err) {
        //! This is optional.
        console.error(err);
      }
    }
    getData()
  },[navigate])
  
  return (
    <div className="Header">
      {user === "" ? <div className="loading" /> : <>
      <div className="logo-cont">
        <img src="/images/logo.svg" alt="logo" className="logo" />
      </div>
      <div className='pages-cont'>
        <Link className="page" to="/">
          <img src="/images/home-icon.svg" alt="home" />
          <p>Home</p>
        </Link>
        <Link className="page" to="/movies">
          <img src="/images/movie-icon.svg" alt="home" />
          <p>Movies</p>
        </Link>
        <Link className="page" to="/watchlist">
          <img src="/images/watchlist-icon.svg" alt="home" />
          <p>Watchlist</p>
        </Link>
      </div>
      <div className="prof-cont">
        <p>Hello, {user.username}</p>
        <p onClick={logout}>Logout</p>
      </div></>}
    </div>
  )
}

export default Head