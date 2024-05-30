import React from 'react'
import "../styles/Cards.css"
import Card from "./Card"

function Cards() {
  return (
    <div className="Cards">
        <Card img="/images/viewers-disney.png" vid="/videos/disney.mp4" />
        <Card img="/images/viewers-pixar.png" vid="/videos/pixar.mp4" />
        <Card img="/images/viewers-marvel.png" vid="/videos/marvel.mp4" />
        <Card img="/images/viewers-starwars.png" vid="/videos/star-wars.mp4" />
        <Card img="/images/viewers-national.png" vid="/videos/national-geographic.mp4" />
    </div>
  )
}

export default Cards