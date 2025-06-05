import "../../css/MovieCard.css"
import { useMovieContext } from "../../contexts/MovieContext"
import { redirect, Route } from "react-router-dom"
import { Navigate,useNavigate } from "react-router-dom"
import movie_page from "./movie_page"

function MovieCard({movie}){
    const navigate =  useNavigate()
    const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext()
    const favorite = isFavorite(movie.id)
    function onFavouriteClick(e){
        e.preventDefault()
        if (favorite) removeFromFavorites(movie.id)
            else addToFavorites(movie.id)
    }
    const redirect = (e)=>{
       e.preventDefault();
       navigate(`/movie/${movie.id}`)
    }

    return <div className="movie-card" onClick={redirect} role="button">
        <div className="movie-poster">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}></img>
            <div className="movie-overlay">
                <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavouriteClick}>
                    ⚡
                </button>
            </div>
        </div>
        <div className="movie-info">
            <h1>{movie.title}</h1>
            <p>{movie.release_date?.split("-")[0]}</p>
        </div>
    </div>
}

export default MovieCard