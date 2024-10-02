import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
} from 'react-native-track-player';

export async function setupPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.getActiveTrackIndex();
    isSetup = true;
  }
  catch {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      progressUpdateEventInterval: 2,
    });

    isSetup = true;
  }
  finally {
    return isSetup;
  }
};

// export async function addTracks(tracks) {
//    // Primeiro, limpa a fila de reprodução atual para garantir que estamos começando do zero.
//    await TrackPlayer.reset();

//    // Adiciona as novas faixas à fila de reprodução.
//    await TrackPlayer.setQueue(tracks);
 
//    // Define o modo de repetição para a fila. Isso garante que a fila se repita conforme definido.
//    await TrackPlayer.setRepeatMode(RepeatMode.Queue);

//   // try {
//   //   console.log("Resetando TrackPlayer e adicionando novas faixas");
//   //   await TrackPlayer.reset();
//   //   await TrackPlayer.add(tracks);
//   //   await TrackPlayer.setRepeatMode(RepeatMode.Queue);
//   //   console.log("Faixas adicionadas com sucesso");
//   // } catch (error) {
//   //   console.error("Erro ao adicionar faixas ao TrackPlayer:", error);
//   // }
// };