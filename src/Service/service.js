import TrackPlayer, {Event} from 'react-native-track-player';

module.exports = async () => {
    TrackPlayer.addEventListener(Event.RemotePlay, () => {
    console.log('O player foi inicializado');
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    console.log('Event.RemotePause');
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    console.log('Event.RemoteNext');
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    console.log('Event.RemotePrevious');
    TrackPlayer.skipToPrevious();
  });

  // Adicione outros manipuladores de eventos conforme necessário.
};