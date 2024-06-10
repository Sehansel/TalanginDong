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

  let initials = '';
  const labelArray = label.trim().toUpperCase().split(/[\s_]/g);
  if (labelArray.length === 1) {
    initials = `${labelArray[0].charAt(0)}`;
  } else {
    initials = `${labelArray[0].charAt(0)}${labelArray[labelArray.length - 1].charAt(0)}`;
  }

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
