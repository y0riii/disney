import React from 'react'
import "../styles/Card.css"

function Card({img, vid}) {
  return (
    <div className='Card'>
        <img src={img} alt="view" />
        <video src={vid} loop muted autoPlay />
    </div>
  )
}

export default Card