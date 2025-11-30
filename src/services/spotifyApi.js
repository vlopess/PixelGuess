import axios from 'axios';

const CLIENT_ID = import.meta.env.VITE_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_APP_SPOTIFY_CLIENT_SECRET;
const BASE_URL = 'https://api.spotify.com/v1';

let accessToken = null;
let tokenExpiration = null;

const getAccessToken = async () => {
    if (accessToken && tokenExpiration && Date.now() < tokenExpiration) {
        return accessToken;
    }

    try {

        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            'grant_type=client_credentials',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
                }
            }
        );

        accessToken = response.data.access_token;
        tokenExpiration = Date.now() + (response.data.expires_in - 60) * 1000;

        console.log('✅ Token obtido com sucesso!');
        return accessToken;

    } catch (error) {
        console.error('❌ Erro ao obter token do Spotify:', error.response?.data || error.message);
        throw new Error('Falha na autenticação com Spotify. Verifique suas credenciais.');
    }
};

const spotifyApi = axios.create({
    baseURL: BASE_URL,
});

spotifyApi.interceptors.request.use(
    async (config) => {
        try {
            const token = await getAccessToken();
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        } catch (error) {
            console.error('❌ Erro no interceptor:', error);
            return Promise.reject(error);
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

spotifyApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('❌ Erro na resposta da API:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.error?.message || error.message
        });
        return Promise.reject(error);
    }
);

export const getAlbumsFromPlaylist = async (playlistId, limit = 6) => {
    try {
        console.log(`🎵 Buscando álbuns da playlist: ${playlistId}`);

        const response = await spotifyApi.get(`/playlists/${playlistId}`, {
            params: {
                fields: 'name,tracks.items(track(album(id,name,artists,images,release_date,album_type),name))'
            }
        });

        if (!response.data.tracks?.items) {
            throw new Error('Playlist não encontrada ou vazia');
        }


        const albumMap = new Map();

        response.data.tracks.items.forEach(item => {
            const album = item.track?.album;

            if (album && album.album_type === 'album' && !albumMap.has(album.id)) {
                albumMap.set(album.id, {
                    id: album.id,
                    title: album.name,
                    image: album.images[0]?.url || '/placeholder-album.jpg',
                    year: album.release_date ? album.release_date.split('-')[0] : 'N/A',
                    artist: album.artists.map(artist => artist.name).join(', '),
                    popularity: Math.floor(Math.random() * 30) + 70,
                    type: 'music',
                    track: item.track.name // Nome da música que originou o álbum
                });
            }
        });

        const uniqueAlbums = Array.from(albumMap.values());


        const shuffledAlbums = uniqueAlbums.sort(() => 0.5 - Math.random());
        return shuffledAlbums.slice(0, limit);

    } catch (error) {
        console.error('❌ Erro ao buscar álbuns da playlist:', error);
        return getFallbackAlbums();
    }
};

const popularPlaylists = {
    'rock': '6jmDxyne7FJ3fVA9CkGYpd',
    'mpb': '6IFxrPDMiUCq2zTWs6BGkJ',
    'brasil': '4o7yGyruMGx41nMVm5hJS6',
    'pop': '3JxYCQeXAy64gZC1jXRP02',
};


const getRandomPlaylist = () => {
    const values = Object.values(popularPlaylists);
    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex];
};


export const getRandomAlbums = async (limit = 6) => {
    return getAlbumsFromPlaylist(getRandomPlaylist(), limit);
};

// Fallback
const getFallbackAlbums = () => {
    const albums = [
        {
            id: '1', title: "After Hours",
            image: "https://i.scdn.co/image/ab67616d00001e02e4c60a7e0e978a6eefd72ec9", year: "2020",
            artist: "The Weeknd", popularity: 90, type: "music"
        },
        {
            id: '2', title: "Future Nostalgia",
            image: "https://i.scdn.co/image/ab67616d00001e0264a5c6d54c78e4c9c629e224", year: "2020",
            artist: "Dua Lipa", popularity: 88, type: "music"
        },
        {
            id: '3', title: "Fine Line",
            image: "https://i.scdn.co/image/ab67616d00001e02833430c6d4c2e7738d0b2c0e", year: "2019",
            artist: "Harry Styles", popularity: 87, type: "music"
        }
    ];

    return albums.sort(() => 0.5 - Math.random()).slice(0, 6);
};
export default {
    getRandomAlbums
};