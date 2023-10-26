import { useEffect, useMemo, useState } from "react"
import confetti from 'canvas-confetti';
import './index.css'

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

async function getRandomMovie(): Promise<Movie>{
  return fetch('https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1', {
      headers: {
        'Authorization':  `Bearer ${import.meta.env.VITE_API_KEY}` 
      }
    }).then(res => res.json() as Promise<{results: Movie[]}>)
      .then(({results: movies}) => movies[Math.floor(Math.random() * movies.length)])

}

function getPartialMovieName(movie: Movie): string{
  //Cantidad de la palabra que deberia estar oculto
  const difficulty = 50;
  //Creo array cuyo largo es la cantidad de caracteres en el nombre de la pelicula
  const indexes = Array.from({length: movie.name.length}, (_, index) => index)
  .sort((index) => movie.name[index] === ' ' ? 1 : Math.random() >= 0.5 ? 1 : -1)
  .slice(0, Math.max(Math.floor(movie.name.length * difficulty / 100)))

  return movie.name.split('').reduce((name, letter, index) => {
    name = name.concat(indexes.includes(index) ? '_' : letter)

    return name
  },'')
}

function App() {

  const [guess, setGuess] = useState<string>('')
  const [hintsCount, setHintsCount] = useState<number>(0)
  const [showHint, setShowHint] = useState<boolean>(false)
  const [points, setPoints] = useState<number>(0)
  const [lives, setLives] = useState<number>(3)
  const [movie, setMovie] = useState<null | Movie>(null)

  const partial = useMemo(() => {
    if(!movie) return ''

    return getPartialMovieName(movie)
  }, [movie])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault();

    if(guess?.toLocaleLowerCase() === movie!.name.toLocaleLowerCase()){
      setPoints(points => points + 1)
      confetti({particleCount: 300, spread: 200});
    }else{
      alert('No adivinaste!')
      setLives(lives => lives - 1)
    }
    setMovie(null)
    setGuess('')
    setShowHint(false)
  }

  function handleReset(){
    setLives(3)
    setPoints(0)
    setHintsCount(0)
  }

  function handleHint(){
    if(!showHint){
      setHintsCount(hintsCount => hintsCount + 1)
    }
    setShowHint(true)
  }

  useEffect(() => {
    getRandomMovie().then(setMovie)
  },[points, lives])

  return (
    <html lang="en">
    <body>
    <main className="container m-auto grid min-h-screen grid-rows-[auto,1fr,auto] px-4">
      <header className="text-xl font-bold leading-[3rem]">zeekit-challenge</header>
      <section>
        <div className="text-center text-xl">Lives: {lives}  -  points: {points}  -  hints: {hintsCount}</div>
        {!movie ? (
          <p>Loading...</p>
        ) : lives ? (
          (
          <form onSubmit={handleSubmit} className="py-8 font-mono flex flex-col gap-4 ">
            <input className="p-4 text-xl tracking-wider" type="text" readOnly value={partial}/>
            <input autoComplete="off" autoFocus value={guess} onChange={event => setGuess(event.target.value)} className="p-4 text-xl tracking-wider" name = "partial" type="text"/>
            <button type="submit">Guess</button>
            <button type="button" onClick={handleHint}>Show hint</button>
            {showHint && (
              <p>{movie.overview}</p>
            )}
          </form>
          )
        ): (
          <div className="text-center p-4 grid gap-4">
            <p className="text-xl">Game over</p>
            <button onClick={handleReset}>Play Again</button>
          </div>
        )}
      </section>
      <footer className="text-center leading-[3rem] opacity-70">
        {new Date().getFullYear()}
      </footer>
    </main>
    </body>
    </html>
  )
}

export default App
