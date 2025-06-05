import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import "../../css/movie_page.css"

const API_KEY = "b3f78d210c4d8e1146495b8fa2571f1a";
const BASE_URL = "https://api.themoviedb.org/3";

const SelectorMoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    async function fetchMovie() {
      const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
      const data = await response.json();
      setMovie(data);
    }
    fetchMovie();
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className='main_box'>
      <div className="left_box">
        <h2>{movie.title}</h2>
        <p>{movie.overview}</p>
        <p>Release Date: {movie.release_date}</p>
        {/* <form>
          <div className="star-rating">
            {[1,2,3,4,5].map((star) => (
              <span
                key={star}
                className={star <= rating ? "star selected" : "star"}
                onClick={() => setRating(star)}
                style={{ cursor: "pointer", fontSize: "2rem", color: star <= rating ? "#e50914" : "#444" }}
                title={`${star} star${star > 1 ? "s" : ""}`}
              >
                ★
              </span>
            ))}
          </div>
          <input placeholder='Write a review'></input>
          <button>Submit</button>
        </form> */}
      </div>
      <div className="right_box">
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      </div>
    </div>
  )
}

export default SelectorMoviePage