import { authorize } from 'react-native-app-auth';
import axios from 'axios';

export let accessToken = ''

const spotifyAuthConfig = {
  clientId: 'c433f37453a7470292bb076c822dd853',
  clientSecret: 'e59e1160cfc04015bcccc75ee4b54f25',
  redirectUrl: 'com.controller:/callback',
  scopes: ['streaming', 'playlist-read-private', 'user-top-read', 'user-read-email', 'user-read-private', 'user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  },
};

export const loginWithSpotify = async () => {
  try {
    const result = await authorize(spotifyAuthConfig);
    // Use result.accessToken para fazer chamadas à API do Spotify
    accessToken = result.accessToken
    // console.log(result.accessToken);
  } catch (error) {
    console.error(error);
  }
};


const spotifyApi = axios.create({
  baseURL: 'https://api.spotify.com/v1',
});

// https://api.spotify.com/v1/browse/categories/{category_id}

export const getTopTracks = async () => {
  spotifyApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  try {
    const response = await spotifyApi.get('/me/top/tracks');
    return response.data.items;
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    throw error;
  }
};

export const getTopHits = async (playlistId) => {
  spotifyApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  try {
    // Substitua '37i9dQZF1DXcBWIGoYBM5M' pelo ID da playlist de sucessos que deseja usar
    // const response = await spotifyApi.get(`/playlists/${categoryId}/tracks`);
    const response = await spotifyApi.get(`/playlists/${playlistId}/tracks`);
    // console.log("getTopHits", response);
    // console.log(JSON.stringify(response, null, 2));
    return response.data.items.map(item => item.track);
  } catch (error) {
    console.error('Error fetching top hits:', error);
    throw error;
  }
};

export const getCategories = async () => {
  spotifyApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  try {
    const response = await spotifyApi.get('/browse/categories', {
      params: {
        limit: 50, // Ajuste conforme necessário
        locale: 'pt-BR', // Ajuste o locale conforme necessário
      },
    });
    // console.log("categories", response.data.categories.items.icons);
    console.log("chamou");
    return response.data.categories.items;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getPlaylistsForCategory = async (categoryId) => {
  spotifyApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  try {
    const response = await spotifyApi.get(`/browse/categories/${categoryId}/playlists`, {
      params: {
        limit: 50, // Ajuste conforme necessário
      },
    });

    // console.log("categories", response.data.playlists.items)

    return response.data.playlists.items;
  } catch (error) {
    console.error(`Error fetching playlists for category ${categoryId}:`, error);
    throw error;
  }
};

// export const fetchAvailableDevices = async () => {
//   try {
//     const response = await spotifyApi.get(`/me/player/devices`, {
//       headers: {
//         'Authorization': `Bearer ${accessToken}`
//       }
//     });
//     console.log('onPressMusicItem:', JSON.stringify(response, null, 2));
//     return response.data.devices; // Array de dispositivos
//   } catch (error) {
//     console.error('Erro ao buscar dispositivos:', error);
//     return [];
//   }
// };

export const fetchAvailableDevices = async () => {
  const endpoint = 'https://api.spotify.com/v1/me/player/devices';
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.get(endpoint, { headers });
    // console.log('Dispositivos disponíveis:', response.data.devices);
    // console.log('onPressMusicItem:', JSON.stringify(response.data.devices, null, 2));
    return response.data.devices; // Retorna a lista de dispositivos
  } catch (error) {
    console.error('Erro ao buscar dispositivos disponíveis:', error.response ? error.response.data : error.message);
    return []; // Retorna uma lista vazia em caso de erro
  }
};

export const playTrackOnDevice = async (deviceId, trackUri) => {
  try {
    await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      uris: [trackUri], // Lista de URIs de faixas para tocar
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log('Reprodução iniciada com sucesso.');
  } catch (error) {
    console.error('Erro ao iniciar reprodução:', error);
  }
};



// console.log('onPressMusicItem:', JSON.stringify(musicInfo, null, 2));