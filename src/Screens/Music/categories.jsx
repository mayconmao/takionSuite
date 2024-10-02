import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';

import { useMusicContext } from '../../context/MusicContext';
import { CustomTouchableOpacity } from '../../Components/CustomTouchableOpacity';

export const ListCategories = () => {
  const { categories } = useMusicContext();

  const [playlists, setPlaylists] = useState([]);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const obterDetalhesArtistas = async (categorias) => {
      // const rootDir = `/storage/emulated/0/Music/categoria/${categorias}`;
      const rootDir = `/storage/EEB2-2A3D/categoria/${categorias}`;
      try {
        const artistas = await RNFS.readDir(rootDir);
        let detalhesArtistas = await Promise.all(artistas.map(async (artista) => {
          const caminhoCompleto = `${artista.path}/capa.png`;
          let existeImagem = false;

          try {
            const stat = await RNFS.stat(caminhoCompleto);
            existeImagem = stat.isFile();
          } catch (error) {
            existeImagem = false;
          }

          return {
            id: uuid.v4(),
            name: artista.name,
            path: artista.path,
            imagePath: existeImagem ? caminhoCompleto : null,
          };
        }));

        // Verifica se o número total de itens é ímpar e adiciona um espaçador se necessário
        if (detalhesArtistas.length % 2 !== 0) {
          detalhesArtistas = [...detalhesArtistas, { isSpacer: true, id: 'spacer' }];
        }
        setPlaylists(detalhesArtistas); // Atualiza o estado com a lista possivelmente modificada
      } catch (error) {
        console.debug("Erro ao obter detalhes dos artistas:", error);
        setErro(true);
      }
    };

    if (categories) {
      obterDetalhesArtistas(categories);
    }
  }, [categories]); // Dependência para re-executar se 'categories' mudar

  const renderItem = useCallback(({ item, index }) => (<CardRendering key={item.id}{...item} index={index} />), [playlists]);
  const keyExtractor = useCallback(item => String(item.id), []);

  let content;
  if (!categories || (playlists.length === 0 && erro)) {
    content = <ErrorComponent screen={'Library'} />;
  } else {
    // Prepara a lista para renderização se não houver erro
    content = (
      <FlatList
        data={playlists}
        style={styles.wrap}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={1}
      />
    );
  }

  return (
    <View style={styles.container}>
      {content}
    </View>
  );
};

const CardRendering = (item) => {
  const { addTracks } = useMusicContext();
  const navigation = useNavigation();

  const handlePressPlay = async (name) => {
    const obterDetalhesArtistas = async (categorias) => {
      const rootDir = categorias.path;

      try {
        const result = await RNFS.readDir(rootDir);

        const capa = result.find(item => item.name === "capa.png");

        const musica = result.filter(item => item.name.endsWith('.mp3')).map(item => {
          const nameWithoutExtension = item.name.replace('.mp3', '').trim();
          const parts = nameWithoutExtension.split('-', 2);
          const artist = parts[0].trim();
          let title = parts[1] ? parts[1].trim() : artist;

          return {
            id: uuid.v4(),
            url: item.path,
            title,
            artist,
            album: capa, // Usa a capa encontrada anteriormente
          };
        });
        return musica;
      } catch (error) {
        console.debug("Erro ao obter detalhes dos artistas:", error);
        setErro(true); // Atualiza o estado para refletir o erro
        return []; // Retorna imediatamente para interromper a execução da função
      }
    };

    obterDetalhesArtistas(item).then(detalhesArtistas => {
      addTracks(detalhesArtistas);
    });

    navigation.navigate('List');
    // navigation.navigate('List', { name });
  };

  // Verifica se o item é o espaçador
  if (item.isSpacer) {
    // Retorna um componente vazio ou com um estilo específico
    return <CustomTouchableOpacity style={[styles.item, styles.itemSpacer]} />;
  }

  return (
    <CustomTouchableOpacity style={styles.item} onPress={() => handlePressPlay(item)}>
      {item.imagePath ? (
        <Image
          source={{ uri: `file://${item.imagePath}` }}
          style={styles.itemImage}
          resizeMode="contain"
        />
      ) : (
        <Image
          source={require('../../assets/teste.png')}
          style={styles.itemImage}
          resizeMode="contain"
        />
      )}
      <Text style={styles.playlistText}>{item.name}</Text>
    </CustomTouchableOpacity>
  );
};

export const ErrorComponent = () => {

  return (
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'transparent' }
    }>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 25 }}>Não há artistas</Text>
        <Text style={{ color: '#fff', fontSize: 15 }}>Selecione um estilo</Text>
      </View>
    </View>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000'
  },
  wrap: {
    flex: 1,
    // paddingHorizontal: '3%',
  },
  item: {
    flex: 1,
    margin: 5,
    // width: '30%',
    aspectRatio: 3,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 10,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  playlistText: {
    fontSize: 16,
    color: 'tomato'
  },
  itemSpacer: {
    backgroundColor: 'transparent',
  },

  header: {
    width: '12%',
    paddingHorizontal: '4%',
    paddingVertical: '1%',
  },
});