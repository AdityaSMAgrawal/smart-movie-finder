const API_KEY = "b3f78d210c4d8e1146495b8fa2571f1a"
const BASE_URL = "https://api.themoviedb.org/3"

//getPopularMovies is the variable that is being assigned the value as a function 
//getPopularMovies();
export const getPopularMovies = async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
    const data = await response.json()
    return data.results
}

export const searchMovies = async (query) => {
    const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)//encodeURIComponent is for encoding 
    const data = await response.json()
    return data.results
}