import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/movie_card";
import { searchMovies, getPopularMovies } from "../../services/api"
import "../../css/Home.css"

function Home(){
    const navigate = useNavigate();

    //useState returns the current state and a function to update that state
    const [searchQuery, setSearchQuery] = useState("");

    //array of javascript objects following JASON(javascript object notation) format 
    // const movies = [
    //     {id: 1, title: "John Wick", release_date: "2020"},
    //     {id: 2, title: "Openhimer", release_date: "2021"},
    //     {id: 3, title: "Haunting of the hill house", release_date: "1999"},
    //     {id: 4, title: "The Shining", release_date: "1992"},
    //     {id: 5, title: "Deadpool vs Wolverine", release_date: "2022"}
    // ]

    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    //pass a function and a array, whenver rereder takes place the funciton is called if the array has
    //changed, null values over here mean we only run this one time when the component is rendered on screen
    useEffect(() => {
        const loadPopularMovies = async () => {
            try{
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
            }
            catch(err){
                console.log(err)
                setError("Failed to load movies...")
            }
            //finally block runs irrecpective or what happend in try, catch
            finally{setLoading(false)}
        }
        loadPopularMovies()
    }, [])

    const handleSearch = async (e) => {
        e.preventDefault()
        if(!searchQuery.trim()) return 
        if(loading) return 

        setLoading(true)
        try{
            const searchResults = await searchMovies(searchQuery);
            setMovies(searchResults);
            setError(null);
            }
        catch(err) {
            console.log(err);
            setError("Failed to load movie...");
        }
        finally{
            setLoading(false)
        }
        // setSearchQuery("")
    }

    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input type="text"
                 placeholder="Search for movies ..." 
                 className="search-input"
                 value={searchQuery}
                 //.target(propertie of event object) -> this input box
                 onChange={(e) => setSearchQuery(e.target.value)}
                 />
                <button type="submit" className="search-button">Search</button>
            </form>

            {error && <div className="error-message">{error}</div>}     

            {loading ? <div className= "loading">Loading...</div> : <div>
                <div className="movies-grid">
                    {/* .map is a propertie that puts every value in the array in the function*/}
                    {movies.map((movie) => (
                        movie.title.toLowerCase().startsWith(searchQuery) && 
                        (<MovieCard movie={movie} key={movie.id}/>)
                    ))}
            </div>
            </div>}
            <button
                className="eu-button"
                onClick={() => navigate("/eu")}
            >
                Explore EU Movies
            </button>
        </div>
    );
}

export default Home