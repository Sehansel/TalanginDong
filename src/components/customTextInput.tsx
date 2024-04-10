import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

import { COLOR } from '../theme';

interface ICustomTextInputProps {
  isSecureInput?: boolean;
  label?: string;
  value?: string;
  onChangeText?: ((text: string) => void) & Function;
  error?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export const CustomTextInput: React.FC<ICustomTextInputProps> = observer(
  function CustomTextInput(props) {
    const { isSecureInput = false, label, value, onChangeText, error, autoCapitalize } = props;
    const [isPasswordHidden, setIsPasswordHidden] = React.useState(true);
    return (
      <TextInput
        mode='outlined'
        label={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isSecureInput ? isPasswordHidden : false}
        autoCapitalize={autoCapitalize ? autoCapitalize : isSecureInput ? 'none' : 'sentences'}
        right={
          isSecureInput ? (
            <TextInput.Icon
              icon={isPasswordHidden ? 'eye' : 'eye-off'}
              onPress={() => setIsPasswordHidden(!isPasswordHidden)}
              style={styles.eyeIcon}
            />
          ) : undefined
        }
        style={styles.textInput}
        activeOutlineColor={COLOR.PRIMARY}
        outlineColor={COLOR.GREY_1}
        theme={{
          colors: {
            background: COLOR.GREY_2,
          },
        }}
        error={error}
      />
    );
  },
);

const styles = StyleSheet.create({
  textInput: {
    width: '100%',
    height: 50,
  },
  eyeIcon: {
    marginTop: 15,
  },
});
