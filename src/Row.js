import React, { useState, useEffect } from "react";
import axios from "./axios";
import axios2 from "./axios2";
import "./Row.css";
import YouTube from "react-youtube";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchURL, isLargerow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, settrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchURL);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchURL]);

  async function fetchVideoData(movie) {
    const request = await axios2.get(
      `/${movie.id}?api_key=af49b918f8432975d136bc17a80498a3&append_to_response=videos`
    );

    console.log(request.data.videos.results[0].key);
    settrailerUrl(request.data.videos.results[0].key);
    // return 0;
  }
  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      settrailerUrl("");
    } else {
      fetchVideoData(movie);
      console.log(`name  ${trailerUrl}`);
    }
  };
  return (
    <div className="row">
      {/* title */}
      <h2>{title}</h2>
      <div className="row_posters">
        {/* container posters */}{" "}
        {movies.map((movie) => (
          <div className="poster_details">
            <img
              key={movie.id}
              onClick={() => handleClick(movie)}
              className={`row_poster ${isLargerow && "row_posterLarge"}`}
              src={`${base_url}${
                isLargerow ? movie.poster_path : movie.backdrop_path
              }`}
              alt={movie.original_title}
            />
            <h3>
              {truncate(
                movie?.title || movie?.name || movie?.original_name,
                15
              )}
            </h3>
          </div>
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
