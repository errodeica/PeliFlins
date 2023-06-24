import React, { useState, useEffect } 
from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import './App.css'
import Logo from './assets/logoapp.svg';

function App() {
  const API_URL = 'https://api.themoviedb.org/3';
  const API_KEY = '59e19caa31ac8fdb2b1dd6eaeba63f9e';
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/original';
  const URL_IMAGE = 'https://image.tmdb.org/t/p/original';


  //variables de estado
  const [movies, setMovies] = useState([])
  const [searchKey, setSearchKey] = useState("")
  const [trailer, setTrailer] = useState(null)
  const [movie, setMovie] = useState({title: "Cargando películas"})
  const [playing, setPlaying] = useState(false)

  //funcion para realizar la peticion get por la API
  const fetchMovies = async(searchKey) =>{
  const type = searchKey ? "search" : "discover"
  const {
      data:{results},
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params:{
        api_key: API_KEY,
        query: searchKey,
    },
  });

  setMovies(results)
  setMovie(results[0])

  if(results.length) {
    await fetchMovie(results[0].id)
  }
}

//funcion para la peticion de un solo objeto y mostrar en el reproductor de video
const fetchMovie = async(id)=>{
  const {data} = await axios.get(`${API_URL}/movie/${id}`,{
    params:{
      api_key: API_KEY,
      append_to_response: 'videos'
    }
  })

  if(data.videos && data.videos.results){
    const trailer = data.videos.results.find(
      (vid) => vid.name === 'Official Trailer'
    );
    setTrailer(trailer ? trailer : data.videos.results[0])
  }
  setMovie(data)
}

const selectMovie = async(movie)=>{
  fetchMovie(movie.id)
  setMovie(movie)
  window.scrollTo(0,0)
}

//funcion para buscar peliculas
const searchMovies = (e)=> {
  e.preventDefault();
  fetchMovies(searchKey)
}

useEffect(()=>{
  fetchMovies();
},[])

  return (
    <div>
      <h1 className='text-center mt-5 mb-2 display-2'>
      <img src={Logo} alt="Logotipo rollo de película" className="logo" />
        PeliFlins</h1>
      <h3 className='text-center mt-2 mb-5 text-primary'>Estrenos & películas</h3>
      {/* buscador */}
      <form className='container mb-4' onSubmit={searchMovies}>
        <input type='text' placeholder='Buscar película' onChange={(e)=> setSearchKey(e.target.value)}/>
        <button className='btn btn-primary'>Buscar</button>
      </form>

      {/*Aquí va todo el contenedor del banner y el reproductor del vídeo*/}
      <div>
        <main>
          {movie ? (
            <div
              className='viewtrailer'
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {
                playing ? (
                  <>
                  <YouTube
                  videoId={trailer.key}
                  className='reproductor container'
                  containerClassName={"youtube-container amru"}
                  opts={{
                    width:'100%',
                    height:'100%',
                    playersVars: {
                      autoplay: 1,
                      controls: 0,
                      cc_load_policy: 0,
                      fs: 0,
                      iv_load_policy: 0,
                      modestbranding: 0,
                      rel: 0,
                      showinfo: 0,
                    },
                  }}
                  />
                  <button onClick={() => setPlaying(false)} className='boton'>
                    Cerrar
                  </button>
                  </>
                ) : (
                  <div className='conatiner'>
                    <div className=''>
                      {
                        trailer ? (
                          <button 
                          className='boton'
                          onClick={() => setPlaying(true)}
                          type='button'
                          >
                            Reproducir el trailer
                          </button>
                        ) : (
                          "Lo siento este trailer no está disponible"
                        )}
                        <h1 className='text-white'>{movie.title}</h1>
                        <p className='text-white'>{movie.overview}</p>
                    </div>
                  </div>
                )}
            </div>
          ) : null}
          </main>
          </div>

      {/* Contenedor para mostar los carteles de las películas actuales */}
      <div className='container mt-3'>
        <div className='row'>
          {movies.map((movie)=>(
            <div key={movie.id} className='col-md-4 mb-3'>
                <img src={`${URL_IMAGE + movie.poster_path}`} alt="cartel película" height={600} width="100%" />
                <h4 className='text-center'>{movie.title}</h4>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}
export default App;
