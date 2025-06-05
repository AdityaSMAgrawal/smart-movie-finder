import { useState } from 'react'
import './css/App.css'
import MovieCard from './assets/components/movie_card'
import Home from "./assets/pages/home.jsx"
import { MovieProvider } from "../src/contexts/MovieContext.jsx"
import Favorite from './assets/pages/favourite.jsx'
//Routes, Route are special components from react-router-dom 'library' 
import {Routes, Route} from "react-router-dom"
import NavBar from './assets/pages/nav-bar.jsx'
import { createBrowserRouter } from 'react-router-dom'
import MovieSelector from './assets/pages/movie-selector.jsx'
import MoviePage from "./assets/components/movie_page.jsx"
import SelectorMoviePage from "./assets/components/selector-movie-page.jsx";
import Registration from "./assets/components/registration.jsx"
import Login from "./assets/components/login.jsx"
import Eu from "./assets/pages/eu.jsx";

function App() {
  const [step, setStep] = useState(
    !localStorage.getItem("registered") ? "register" :
    !localStorage.getItem("token") ? "login" : "app"
  );
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");

  // After registration, go to login
  const handleRegistered = () => {
    localStorage.setItem("registered", "yes");
    setStep("login");
  };

  // After login, go to app
  const handleLogin = (userId) => {
    setUserId(userId);
    setStep("app");
  };

  if (step === "register") {
    return <Registration onRegistered={handleRegistered} />;
  }
  if (step === "login") {
    return <Login onLogin={handleLogin} />;
  }

  const movie_number = 1;
  return (
    <div>
      <MovieProvider>
      <NavBar />
      <main className="main-content">
        <Routes>
          {/* self closing tags are used for components with no children*/}
          <Route path="/movieSelector" element={<MovieSelector />}/>
          <Route path="/" element={<Home />} />
          <Route path="/favorite" element={<Favorite />} />
          <Route path="/movie/:id" element={<MoviePage/>} userId={userId}></Route>
          <Route path="/selector-movie/:id" element={<MoviePage/>} userId={userId}  ></Route>
          <Route path="/eu" element={<Eu />} />
        </Routes>
    </main>
    </MovieProvider>
    </div>
  )
}


export default App
