import {
    getRandomAlbums
} from '../services/spotifyApi';

export const useMusic = () => {


    const loadInitialData = async () => {
        try {
            const [genresData] = await Promise.all([
                getRandomAlbums(6)
            ]);

            return (genresData);
        } catch (err) {
            console.error('Erro no loadInitialData:', err);
        }
    };

    return {
        loadInitialData
    };
};