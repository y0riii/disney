import React, { useState, useEffect, useRef } from 'react'
import "../styles/Recommended.css"
import axios from "axios"
import { Link } from "react-router-dom"

function Recommended() {
    const trailerLink = useRef("https://api.themoviedb.org/3/movie/")
    const trailerVideo = useRef("")
    const [trailer, setTrailer] = useState("")
    const [movieCont, setMovieCont] = useState("")
    const movieId = useRef("")
    const selected = useRef(false)
    const imgLink = "https://image.tmdb.org/t/p/w500"
    const [rec, setRec] = useState([])
    let can = useRef(false)
    const span = useRef()
    async function getData() {
        if (can.current === false) return
        await axios.get("https://api.themoviedb.org/3/discover/movie?api_key=a82dba6bb9889277f59ff782635b7140").then((res) => {
            setRec(res.data.results.slice(0, 4))
        })
    }

    function addToWatchList() {
        axios.post("http://192.168.1.11:4000/addWatch", { id: movieId.current }).then(res => {
            if (res.data === "added") { span.current.innerText = "-"; span.current.classList.add("active") }
            else if (res.data === "removed") { span.current.innerText = "+"; span.current.classList.remove("active") }
        })
    }

    async function playTrailer() {
        setTrailer(<div className="youtube">
            <button className="back" onClick={() => { setTrailer("") }}>Back</button>
            <iframe
                src={`https://www.youtube.com/embed/${trailerVideo.current.key}`}
                frameBorder="0"
                className="vid"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
            />
        </div>)
    }

    async function showTrailer(movie) {
        if (selected.current === false) return
        axios.post("http://192.168.1.11:4000/findWatch", { id: movie.id }).then(res => {
            if (res.data === "found") { span.current.innerText = "-"; span.current.classList.add("active") }
            else { span.current.innerText = "+"; span.current.classList.remove("active") }
        })
        setMovieCont(<div className="movie-cont">
            <img src={imgLink + movie["backdrop_path"]} className="cover" alt="cover" />
            <div className="staff-wrapper">
                <p className="movie-title">{movie.title}</p>
                <div className="actions-cont">
                    <button onClick={addToWatchList}><span ref={span}></span> WatchList</button>
                    <button onClick={playTrailer}><img src="/images/play-icon-white.png" alt="icon" />Trailer</button>
                    <button onClick={() => { setMovieCont(""); trailerVideo.current = "" }}>Back</button>
                </div>
                <div className="info">
                    <p><span className="span">Average rating</span> : {Math.floor(parseFloat(movie["vote_average"]) * 10)} out of 100.</p>
                    <p><span className="span">For adults</span> : {movie.adult === false ? "No" : "Yes"}</p>
                    <p><span className="span">Overview</span> : {movie.overview}</p>
                </div>
            </div>
        </div>)
        await axios.get(trailerLink.current + movie.id + "?api_key=a82dba6bb9889277f59ff782635b7140&append_to_response=videos").then(res => {
            for (let i = 0; i < res.data.videos.results.length; i++) {
                if (res.data.videos.results[i].name.toLowerCase().includes("trailer") === true) {
                    trailerVideo.current = res.data.videos.results[i]
                    break
                }
            }
            if (trailerVideo.current === "") {
                trailerVideo.current = res.data.videos.results[0]
            }
        })
    }

    useEffect(() => {
        if (can.current === true) getData()
        can.current = true
        selected.current = true
    }, [])
    return (
        <div className="Recommended">
            {movieCont}
            {trailerVideo.current !== "" ? trailer : null}
            <Link to="/movies" className="rec">Recommended for you</Link>
            <div className="rec-cont">
                {rec.length === 0 ? "loading" : rec.map(movie => {
                    return <img alt="img" src={imgLink + movie["backdrop_path"]} key={movie.id} onClick={() => { showTrailer(movie) }} />
                })}
            </div>
        </div>
    )
}

export default Recommended