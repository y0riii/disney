import React from 'react'
import "../styles/Home.css"
import Head from "./Header"
import ImageSlider from "./ImageSlider"
import Cards from "./Cards"
import Recommended from "./Recommended"

function Home() {
  return (
    <div className="Home">
      <Head />
      <ImageSlider />
      <Cards />
      <Recommended />
    </div>
  )
}

export default Home