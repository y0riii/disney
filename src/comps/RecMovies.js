import React, { useState, useEffect, useRef } from 'react'
import "../styles/RecMovies.css"
import axios from "axios"

function RecMovies() {
    let can = useRef(false)
    const selected = useRef(false)
    const imgLink = "https://image.tmdb.org/t/p/w500"
    const [text, setText] = useState("")
    const [movies, setMovies] = useState([])
    const [movieCont, setMovieCont] = useState("")
    const [trailer, setTrailer] = useState("")
    const span = useRef()
    const movieId = useRef("")
    const movs = useRef([])
    const trailerVideo = useRef("")
    const trailerLink = useRef("https://api.themoviedb.org/3/movie/")
    async function search(e) {
        e.preventDefault()
        if (text === "") return
        await axios.get("https://api.themoviedb.org/3/search/movie?api_key=a82dba6bb9889277f59ff782635b7140", {
            params: {
                query: text
            }
        }).then(res => {
            movs.current = []
            for (let i = 0; i < res.data.results.length; i++) {
                if (res.data.results[i]["backdrop_path"] !== null) {
                    movs.current.push(res.data.results[i])
                }
            }
        })
        let arr = []
        for (let i = 0; i < movs.current.length; i++) {
            await axios.get(trailerLink.current + movs.current[i].id + "?api_key=a82dba6bb9889277f59ff782635b7140&append_to_response=videos").then(res => {
                if (res.data.videos.results.length !== 0) {
                    arr.push(res.data)
                }
            })
        }
        setMovies(arr)
    }
    async function getData() {
        if (can.current === false) return
        await axios.get("https://api.themoviedb.org/3/discover/movie?api_key=a82dba6bb9889277f59ff782635b7140").then((res) => {
            setMovies(res.data.results)
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

    function addToWatchList() {
        axios.post("http://192.168.1.11:4000/addWatch", { id: movieId.current }).then(res => {
            if (res.data === "added") { span.current.innerText = "-"; span.current.classList.add("active") }
            else if (res.data === "removed") { span.current.innerText = "+"; span.current.classList.remove("active") }
        })
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
                    <button onClick={() => { setMovieCont(""); trailerVideo.current = ""; movieId.current = "" }}>Back</button>
                </div>
                <div className="info">
                    <p><span className="span">Average rating</span> : {Math.floor(parseFloat(movie["vote_average"]) * 10)} out of 100.</p>
                    <p><span className="span">For adults</span> : {movie.adult === false ? "No" : "Yes"}.</p>
                    <p><span className="span">Overview</span> : {movie.overview}.</p>
                </div>
            </div>
        </div>)
        movieId.current = movie
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
        <div className="RecMovies">
            {movieCont}
            {trailerVideo.current !== "" ? trailer : null}
            <form onSubmit={search}>
                <input type="text" placeholder='Search' onChange={(e) => { setText(e.target.value) }} />
                <button type="submit">Search</button>
            </form>
            <div className="movies-cont">
                {movies.length === 0 ? "Loading" : movies.map(movie => {
                    return <div key={movie.id} onClick={() => { showTrailer(movie) }}>
                        <img src={imgLink + movie["backdrop_path"]} alt="backdrop" />
                        <p>{movie.title}</p>
                    </div>
                })}
            </div>
        </div>
    )
}

export default RecMovies