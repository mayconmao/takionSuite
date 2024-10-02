import React from 'react';
import { Text } from 'react-native';

import { CustomTouchableOpacity } from '../CustomTouchableOpacity';
import On from '../../assets/acessa.svg';
import Off from '../../assets/apagada.svg';

export function LightingButton({ title }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <CustomTouchableOpacity
      onPress={() => setIsOpen(!isOpen)}
      style={{
        marginBottom: 3,
        paddingHorizontal: 10,
        paddingVertical: 2,
        backgroundColor: isOpen ? '#686868' : '#7B7B7B',
        transform: [{ scale: isOpen ? 0.96 : 1 }],
        paddingRight: 25,
        paddingLeft: 25,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      {isOpen ? (
        <On fill="#FFC222" width={75} height={75} />
      ) : (
        <Off fill="#434343" width={75} height={75} />
      )}
      <Text style={{ fontSize: 20, color: isOpen ? '#FFC222' : '#c6c6c6', fontWeight: 'bold' }}>
        {title}
      </Text>
    </CustomTouchableOpacity>
  );
};
