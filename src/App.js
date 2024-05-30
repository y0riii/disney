import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./comps/Home.js"
import Movies from "./comps/Movies.js"
import Login from "./comps/Login"
import Register from "./comps/Register"
import WatchList from './comps/WatchList'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <Home />
          }/>
          <Route path="/movies" element={
            <Movies />
          }/>
          <Route path="/login" element={
            <Login />
          } />
          <Route path="/register" element={
            <Register />
          } />
          <Route path="/watchlist" element={
            <WatchList />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
