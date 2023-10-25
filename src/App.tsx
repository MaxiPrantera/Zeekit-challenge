import { useEffect, useMemo, useState } from "react"

export interface Movie{
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

function getRandomMovie(movies: Movie[]): Movie{
  return movies[Math.floor(Math.random() * movies.length)]
}

function getPartialMovieName(movie: Movie): string{

  const indexes = Array.from({length: movie.name.length}, (_, index) => index)
  .sort(() => Math.random() >= 0.5 ? 1 : -1)
  .slice(0, Math.floor(movie.name.length / 2))

  return movie.name.split('').reduce((name, letter, index) => {
    name = name.concat(indexes.includes(index) ? '_' : letter)

    return name
  },'')
}

function App() {

  const [movie, setMovie] = useState<null | Movie>(null)
  const partial = useMemo(() => {
    if(!movie) return ''

    return getPartialMovieName(movie)
  }, [movie])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
  }

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1', {
      headers: {
        'Authorization':  `Bearer ${import.meta.env.VITE_API_KEY}` 
      }
    }).then(res => res.json() as Promise<{results: Movie[]}>).then(data => setMovie(getRandomMovie(data.results)))
  },[])

  if(!movie) {return <div>Loading...</div>
}
  return (
    <main className="container m-auto grid min-h-screen grid-rows-[auto,1rd,auto] px-4">
      <header className="text-xl font-bold leading-[3rem]">zeekit-challenge</header>
      <form onSubmit={handleSubmit} className="py-8 font-mono flex flex-col gap-4 tracking-widest">
        <input className="p-4 text-xl" type="text" readOnly value={partial}/>
        <input className="p-4 text-xl" name = "partial" type="text"/>
        <button type="submit">Guess</button>
        </form>
      <footer className="text-center leading-[3rem] opacity-70">
        {new Date().getFullYear()} zeekit-challenge
      </footer>
    </main>
  )
}

export default App
