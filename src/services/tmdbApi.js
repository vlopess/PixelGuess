import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';


const tmdbApi = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
        language: 'pt-BR'
    }
});

export const getMovieDirector = async (movieId) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}/credits`);
        const crew = response.data.crew;
        const director = crew.find(person => person.job === 'Director');
        return director ? director.name : 'Diretor não encontrado';
    } catch (error) {
        console.error('Erro ao buscar diretor:', error);
        return 'Diretor não encontrado';
    }
};

export const getPopularMoviesWithDirectors = async (page = 1) => {
    try {
        const response = await tmdbApi.get('/discover/movie', {
            params: {
                page,
                with_release_type: "5|3",
                sort_by: 'popularity.desc',
                "air_date.gte": "",
                "air_date.lte": "",
                "certification": "L|16",
                "certification_country": "BR",
                "debug": "",
                "first_air_date.gte": "",
                "first_air_date.lte": "",
                "primary_release_date.gte": "",
                "primary_release_date.lte": "",
                "region": "",
                "release_date.gte": "1900-05-27",
                "release_date.lte": "2020-05-27",
                "show_me": "everything",
                "vote_average.gte": "0",
                "vote_average.lte": "10",
                "vote_count.gte": "0",
                "watch_region": "BR",
                "with_genres": "",
                "with_keywords": "",
                "with_networks": "",
                "with_origin_country": "",
                "with_original_language": "",
                "with_watch_monetization_types": "",
                "with_watch_providers": "",
                "with_runtime.gte": "0",
                "with_runtime.lte": "400"
            }
        });

        return await Promise.all(
            response.data.results.map(async (movie) => {
                const director = await getMovieDirector(movie.id);
                return {
                    id: movie.id,
                    title: movie.title,
                    image: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
                    year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
                    artist: director,
                    type: 'written'
                };
            })
        );
    } catch (error) {
        console.error('Erro ao buscar filmes com diretores:', error);
        throw error;
    }
};


export const getRandomMoviesFormatted = async (count = 6) => {
    try {
        const randomPage = Math.floor(Math.random() * 10) + 1;
        const movies = await getPopularMoviesWithDirectors(randomPage);
        return movies.slice(0, count);
    } catch (error) {
        console.error('Erro ao buscar filmes aleatórios:', error);
        throw error;
    }
};

export default tmdbApi;