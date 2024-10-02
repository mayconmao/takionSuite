import React, { createContext, useContext, useState, useEffect, } from 'react';
import TrackPlayer, { useTrackPlayerEvents, Event, useProgress as tpUseProgress, RepeatMode } from 'react-native-track-player';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [selectedControl, setSelectedControl] = useState(null);
  const [categories, setCategories] = useState(null)
  const [permissaoArmazenamento, setPermissaoArmazenamento] = useState(false);
  const [selectedFrequence, setSelectedFrequence] = useState(null);
  const [volume, setVolume] = useState(10);
  const [activeService, setActiveService] = useState(null);
  const [currentService, setCurrentService] = useState(null);

  const progress = tpUseProgress(1000); // Atualiza a cada segundo

  useEffect(() => {
    const loadPlaylist = async () => {
      const queue = await TrackPlayer.getQueue();
      setQueue(queue);
    };
    loadPlaylist();
  }, []);

  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async () => {
    const track = await TrackPlayer.getActiveTrackIndex();
    setCurrentTrack(track);
  });

  const addTracks = async (tracks) => {
    await TrackPlayer.setQueue(tracks);
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
    await loadQueue();
  };

  const loadQueue = async () => {
    const currentQueue = await TrackPlayer.getQueue();
    setQueue(currentQueue);
  };

  async function shuffleQueue() {
    let currentQueue = await TrackPlayer.getQueue();
    currentQueue.sort(() => Math.random() - 0.5);
    await TrackPlayer.reset();
    await TrackPlayer.add(currentQueue);
    setQueue(currentQueue);
  }

  const currentTrackInfo = queue.find((_, index) => index === currentTrack);

  //lida com categoria selecionada
  const handleCategories = (categoryId) => {
    setCategories(categoryId)
  };

  const resetCategories = (reset) => {
    setCategories(reset)
  };

  const resetList = (reset) => {
    setQueue(reset)
  }

  //##RADIO##
  const handleFrequencySelect = (frequency) => {
    setSelectedFrequence(frequency);
  };

  const contextValue = {
    queue,
    currentTrack,
    currentTrackInfo,
    progress,
    selectedControl,
    categories,
    selectedFrequence,
    permissaoArmazenamento,
    volume,
    activeService,
    currentService,
    setCurrentService,
    setActiveService,
    setVolume,
    setSelectedControl,
    shuffleQueue,
    addTracks,
    setCurrentTrack,
    handleCategories,
    handleFrequencySelect,
    resetList,
    resetCategories
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useBleContext must be used within a BleProvider');
  }
  return context;
};