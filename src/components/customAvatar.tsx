import { observer } from 'mobx-react-lite';
import React from 'react';
import { Avatar } from 'react-native-paper';
import { getStringToHSLString } from 'src/utils/stringToHSL';

interface ICustomAvatarProps {
  label?: string;
  size?: number;
}

export const CustomAvatar: React.FC<ICustomAvatarProps> = observer(function CustomAvatar(props) {
  const { label = 'Test', size } = props;

  const initialsRegex = [...label.matchAll(/(\p{L}{1})\p{L}+/gu)] || [];

  const initials = (
    (initialsRegex.shift()?.[1] || '') + (initialsRegex.pop()?.[1] || '')
  ).toUpperCase();

  return (
    <Avatar.Text
      theme={{
        colors: {
          primary: getStringToHSLString(label),
        },
      }}
      label={initials}
      size={size}
    />
  );
});
