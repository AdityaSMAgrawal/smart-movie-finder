import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import "../../css/movie_page.css"
import axios from 'axios';


const API_KEY = "b3f78d210c4d8e1146495b8fa2571f1a";
const BASE_URL = "https://api.themoviedb.org/3";

const MoviePage = ({ userId }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [watched, setWatched] = useState(false);
  const entryTimeRef = useRef(Date.now());

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tags = movie.genres ? movie.genres.map(g => g.name) : [];
      await axios.post('http://localhost:5000/data', {
        feedback,
        rating,
        movieId: id,
        tags,
        watched,
        userId // <-- this must be included!
      });
      alert('Data saved!');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    async function fetchMovie() {
      const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
      const data = await response.json();
      setMovie(data);
    }
    fetchMovie();
  }, [id]);

  useEffect(() => {
    entryTimeRef.current = Date.now();

    return () => {
      const exitTime = Date.now();
      const timeSpentSeconds = Math.floor((exitTime - entryTimeRef.current) / 1000);

      // Send time spent to backend
      axios.post('http://localhost:5000/data', {
        movieId: id,
        timeSpent: timeSpentSeconds,
        userId // <-- this must be included!
      }).catch(err => console.error(err));
    };
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className='main_box'>
      <div className="left_box">
        <h2>{movie.title}</h2>
        <p>{movie.overview}</p>
        <p>
  {movie.genres && movie.genres.map(g => g.name).join(", ")}
</p>
        <p>Release Date: {movie.release_date}</p>
        <form onSubmit={handleSubmit}>
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
          <input placeholder='Write a review' value={feedback} onChange={e => setFeedback(e.target.value)}/>
          <button type='submit'>Submit</button>
        </form>
        <button
  type="button"
  className="watched-btn"
  style={{ marginBottom: "1rem", background: watched ? "#e50914" : "#444", color: "#fff", border: "none", borderRadius: "6px", padding: "0.5rem 1.2rem", cursor: "pointer" }}
  onClick={async () => {
    try {
      setWatched(true);
      const tags = movie.genres ? movie.genres.map(g => g.name) : [];
      await axios.post('http://localhost:5000/data', { movieId: id, watched: true, tags, watched, userId });
      alert('Marked as watched!');
    } catch (err) {
      console.error(err);
    }
  }}
>
  {watched ? "Watched ✔" : "Mark as Watched"}
</button>
      </div>
      <div className="right_box">
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      </div>
    </div>
  )
}

export default MoviePage