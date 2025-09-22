import React, { use } from "react";
import Axios from "axios";
import { useState,useEffect } from "react";
import { Search, Moon, Sun } from "lucide-react";

function MovieSearch() {
 
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    
  
  
    const [darkMode, setDarkMode] = useState(false);
    

    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem("favorites");
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Error reading favorites from localStorage:", error);
            return [];
        }
    });

    useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);
  
    const addFavorite = (movie) => {
    if (!favorites.some((fav) => fav.imdbID === movie.imdbID)) {
      setFavorites([...favorites, movie]);
    }
  };

  
  const removeFavorite = (movie) => {
    const newFavorites = favorites.filter(
      (fav) => fav.imdbID !== movie.imdbID
    );
    setFavorites(newFavorites);
  };

    
    const API_KEY=import.meta.env.VITE_OMDB_API_KEY;
    const API_URL=`https://www.omdbapi.com/?apikey=${API_KEY}`;
    const fetchMovies = async (query) => {
        setLoading(true);
        setError(null);

        try {
           
            const response = await 
            Axios.get(`/api/movies?q=${query}`)

            if (response.data.Response === "True") {
                setMovies(response.data.Search);
            } else {
                setError(response.data.Error);
            }
        } catch (error) {
            setError("An error occurred while fetching movies.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchMovies("Avengers");
    }, []);

    const handleSearch = () => {
        if (searchTerm.trim()) {
            fetchMovies(searchTerm);
        }
    };
    const toggleFavorite = (movie) => {
        if (favorites.includes(movie)) {
            setFavorites(favorites.filter((fav) => fav.imdbID !== movie.imdbID));
        } else {
            setFavorites([...favorites, movie]);
        }
    };

    const toggleDarkMode = () => {
        document.body.classList.toggle("dark-mode");
    };

  
   


   


    return (
    <div className="movie-search-app">
        <h1>🎥 Movie Search App</h1>
         <button
            onClick={() => toggleDarkMode(!darkMode)}
            className="dark-mode-toggle"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
        <input className="search-input" type="search" placeholder="Search for a movie..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button className="search-button" onClick={handleSearch}> <i className="fas fa-search"></i>Search</button>
        
        <h2 className="favorites-title">⭐ Favorites ({favorites.length})</h2>
        <div className="favorites-list">
            {favorites.map((movie) => (
                <div key={movie.imdbID} className="movie-item">
                    <h3 className="movie-title">{movie.Title}</h3>
                    <p className="movie-year">{movie.Year}</p>
                    <img className="movie-poster" 
                    src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"} alt={movie.Title} />
                    <button className="remove-favorite-button" 
                    onClick={() => removeFavorite(movie)}>
                        ❌
                    </button>
                </div>
            ))}
        </div>
        <div className="movie-list">
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {movies.map((movie) => (
                <div key={movie.imdbID} className="movie-item">
                    
                    <h3 className="movie-title">{movie.Title}</h3>
                    <p className="movie-year">{movie.Year}</p>
                    <img className="movie-poster" 
                    src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"} alt={movie.Title} />
                    <button className="favorite-button" 
                    onClick={() => addFavorite(movie)}>
                        {favorites.includes(movie) ? "❤️" : "🤍"}
                    </button>
                </div>
            ))}
        </div>
      </div>
    );
}
export default MovieSearch;