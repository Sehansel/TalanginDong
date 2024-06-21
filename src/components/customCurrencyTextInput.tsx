import { observer } from 'mobx-react-lite';
import React from 'react';
import { MaskedTextInput } from 'react-native-mask-text';
import { CustomTextInput } from 'src/components/customTextInput';

type ICustomCurrencyTextInputProps = React.ComponentProps<typeof CustomTextInput>;

export const CustomCurrencyTextInput: React.FC<ICustomCurrencyTextInputProps> = observer(
  function CustomCurrencyTextInput(props) {
    return (
      <CustomTextInput
        {...props}
        keyboardType='numeric'
        render={(props) => (
          <MaskedTextInput
            {...props}
            type='currency'
            options={{
              decimalSeparator: '.',
              groupSeparator: ',',
              precision: 2,
            }}
            onChangeText={(text, rawText) => {
              if (props.onChangeText) {
                props.onChangeText(rawText);
              }
            }}
          />
        )}
      />
    );
  },
);
