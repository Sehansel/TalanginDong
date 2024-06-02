import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { COLOR } from 'src/theme';

type ICustomTextInputProps = React.ComponentProps<typeof TextInput> & { errorText?: string };

export const CustomTextInput: React.FC<ICustomTextInputProps> = observer(
  function CustomTextInput(props) {
    const { errorText, secureTextEntry, autoCapitalize } = props;
    const [isPasswordHidden, setIsPasswordHidden] = React.useState(true);
    return (
      <View style={styles.container}>
        <TextInput
          mode='outlined'
          secureTextEntry={secureTextEntry ? isPasswordHidden : false}
          autoCapitalize={autoCapitalize ? autoCapitalize : secureTextEntry ? 'none' : 'sentences'}
          right={
            secureTextEntry ? (
              <TextInput.Icon
                icon={isPasswordHidden ? 'eye' : 'eye-off'}
                onPress={() => setIsPasswordHidden(!isPasswordHidden)}
                style={styles.eyeIcon}
              />
            ) : undefined
          }
          textColor='black'
          style={styles.textInput}
          activeOutlineColor={COLOR.PRIMARY}
          outlineColor={COLOR.GREY_1}
          theme={{
            colors: {
              background: COLOR.GREY_2,
              error: COLOR.RED,
            },
          }}
          error={!(!errorText || errorText === '')}
          {...props}
        />
        {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  textInput: {
    width: '100%',
    height: 50,
  },
  eyeIcon: {
    marginTop: 15,
  },
  error: {
    fontSize: 14,
    paddingHorizontal: 4,
    paddingTop: 4,
    color: COLOR.RED,
  },
});
