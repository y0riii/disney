import React from 'react'
import "../styles/Movies.css"
import Header from "./Header"
import RecMovies from './RecMovies'

function Movies() {
  return (
    <div className='Movies'>
        <Header />
        <RecMovies />
    </div>
  )
}

export default Movies