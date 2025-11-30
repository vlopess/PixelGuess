import {getRandomMoviesFormatted} from '../services/tmdbApi';

export const useMovies = () => {


  const loadRandomMovies = async () => {

    try {
      return await getRandomMoviesFormatted(6);
    } catch (err) {
      return (getFallbackMovies());
    }
  };

  return {
    loadRandomMovies
  };
};

// Fallback caso a API falhe
const getFallbackMovies = () => [
  { id: 101, title: "Pulp Fiction", image: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", year: "1994", artist: "Quentin Tarantino", difficulty: "medium", type: "written" },
  { id: 102, title: "The Matrix", image: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", year: "1999", artist: "Wachowskis", difficulty: "easy", type: "written" },
  { id: 103, title: "Interstellar", image: "https://image.tmdb.org/t/p/w500/gEU2QniL6C8z1dY4kdMor0UJC79.jpg", year: "2014", artist: "Christopher Nolan", difficulty: "hard", type: "written" },
  { id: 104, title: "Spirited Away", image: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUKGnSxQbUgZ.jpg", year: "2001", artist: "Hayao Miyazaki", difficulty: "medium", type: "written" },
  { id: 105, title: "Joker", image: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", year: "2019", artist: "Todd Phillips", difficulty: "easy", type: "written" },
  { id: 106, title: "Fight Club", image: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", year: "1999", artist: "David Fincher", difficulty: "medium", type: "written" },
];