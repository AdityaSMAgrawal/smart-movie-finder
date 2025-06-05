import React, { useEffect, useState } from "react";
import MovieCard from "../components/movie_card";

const API_KEY = "b3f78d210c4d8e1146495b8fa2571f1a";
const BASE_URL = "https://api.themoviedb.org/3";

function Eu() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchUserTags() {
    return "romantic comedy teenage love"; // Example tags
  }

  // Fetch movie details from TMDB by title
  async function fetchMovieByTitle(title) {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
    );
    const data = await res.json();
    return data.results && data.results.length > 0 ? data.results[0] : { title };
  }

  useEffect(() => {
    async function getRecommendations() {
      setLoading(true);
      const tags = await fetchUserTags();
      const res = await fetch("http://127.0.0.1:8000/eu-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags }),
      });
      const data = await res.json();
      // Fetch full movie details for each title
      const moviesWithDetails = await Promise.all(
        (data.recommendations || []).map(fetchMovieByTitle)
      );
      setMovies(moviesWithDetails);
      setLoading(false);
    }
    getRecommendations();
  }, []);

  return (
    <div className="eu-page">
      <h1>Explore Into the Unknown</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie, idx) => (
            <MovieCard key={movie.id || idx} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Eu;