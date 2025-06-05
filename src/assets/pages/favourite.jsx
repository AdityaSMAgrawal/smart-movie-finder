import { useEffect, useState } from "react";
import { useMovieContext } from "../../contexts/MovieContext";
import MovieCard from "../components/movie_card";
import "../../css/Favorites.css";

const API_KEY = "b3f78d210c4d8e1146495b8fa2571f1a"; // <-- your TMDB API key

function Favourite() {
  const { favorites } = useMovieContext();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
      const movieData = await Promise.all(
        favorites.map(id =>
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
            .then(res => res.json())
        )
      );
      setMovies(movieData);
    }
    if (favorites.length) fetchMovies();
    else setMovies([]);
  }, [favorites]);

  if (!favorites.length) {
    return (
      <div className="favorites-empty">
        <h2>No Favourites Yet</h2>
        <p>Add some movies to your favourites!</p>
      </div>
    );
  }

  return (
    <div className="movies-grid">
      {movies.map(movie => (
        <MovieCard movie={movie} key={movie.id} />
      ))}
    </div>
  );
}

export default Favourite;