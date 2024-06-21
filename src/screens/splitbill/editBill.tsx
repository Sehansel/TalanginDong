import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { MaskedText } from 'react-native-mask-text';
import { Button, Divider } from 'react-native-paper';
import { CustomCurrencyTextInput } from 'src/components/customCurrencyTextInput';
import { CustomTextInput } from 'src/components/customTextInput';
import { useStores } from 'src/models';
import { SplitBillNavigatorParamList } from 'src/navigations/splitBillNavigator';
import { COLOR } from 'src/theme';
import { currencyToNumber, numberToCurrency } from 'src/utils/currencyModifier';

interface IEditBillProps {
  navigation: StackNavigationProp<SplitBillNavigatorParamList>;
}

export const EditBillScreen: React.FC<IEditBillProps> = observer(function EditBillScreen(props) {
  const { splitBillStore } = useStores();
  const { navigation } = props;
  return (
    <>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View
            style={{
              width: '100%',
            }}>
            <CustomTextInput
              style={{
                width: '90%',
                alignSelf: 'center',
              }}
              placeholder='test'
              value={splitBillStore.billName}
              onChangeText={(text) => splitBillStore.setBillName(text)}
            />
          </View>
          {splitBillStore.items.slice().map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'column',
                  width: '90%',
                  marginTop: index === 0 ? 8 : 20,
                }}>
                <Divider style={{ marginBottom: 8 }} />
                <CustomTextInput
                  style={styles.itemInput}
                  value={item.item}
                  onChangeText={(text) => splitBillStore.setItem({ item: text }, index)}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                  }}>
                  <CustomCurrencyTextInput
                    style={styles.itemInputCurrency}
                    containerStyle={{
                      width: '35%',
                    }}
                    value={numberToCurrency(item.pricePerItem)}
                    onChangeText={(currency) => {
                      splitBillStore.setItem({ pricePerItem: currencyToNumber(currency) }, index);
                    }}
                    textAlign='right'
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '65%',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      columnGap: 5,
                    }}>
                    <CustomTextInput
                      style={styles.itemInput}
                      containerStyle={{
                        width: 50,
                      }}
                      value={item.quantity.toString()}
                      onChangeText={(text) =>
                        splitBillStore.setItem({ quantity: parseInt(text, 10) }, index)
                      }
                    />
                    <Text>X</Text>
                    <CustomCurrencyTextInput
                      style={styles.itemInputCurrency}
                      containerStyle={{
                        width: '55%',
                      }}
                      value={numberToCurrency(item.price)}
                      onChangeText={(currency) => {
                        splitBillStore.setItem({ price: currencyToNumber(currency) }, index);
                      }}
                      textAlign='right'
                    />
                  </View>
                </View>
              </View>
            );
          })}
          <View
            style={{
              width: '90%',
              marginTop: 20,
            }}>
            <Button
              mode='contained'
              icon='plus'
              buttonColor={COLOR.PRIMARY}
              style={{ width: 120, alignSelf: 'flex-start' }}
              onPress={() => splitBillStore.createItem()}>
              Add item
            </Button>
          </View>
          <Divider style={{ width: '90%', marginVertical: 20 }} />
          <Text style={{ textAlign: 'left', width: '90%', fontWeight: 'bold' }}>Summary</Text>
          <Divider style={{ width: '90%', marginVertical: 20 }} />
          <View style={styles.summaryView}>
            <Text>Subtotal</Text>
            <MaskedText
              style={styles.maskedTextCurrency}
              type='currency'
              options={{
                decimalSeparator: '.',
                groupSeparator: ',',
                precision: 2,
              }}>
              {numberToCurrency(splitBillStore.subtotal)}
            </MaskedText>
          </View>
          <View style={styles.summaryView}>
            <Text>Tax</Text>
            <CustomCurrencyTextInput
              style={styles.itemInputCurrency}
              containerStyle={{
                width: '40%',
              }}
              value={numberToCurrency(splitBillStore.tax)}
              onChangeText={(currency) => {
                splitBillStore.setTax(currencyToNumber(currency));
              }}
            />
          </View>
          <View style={styles.summaryView}>
            <Text>Discount</Text>
            <CustomCurrencyTextInput
              style={styles.itemInputCurrency}
              containerStyle={{
                width: '40%',
              }}
              value={numberToCurrency(splitBillStore.discount)}
              onChangeText={(currency) => {
                splitBillStore.setDiscount(currencyToNumber(currency));
              }}
            />
          </View>
          <View style={styles.summaryView}>
            <Text>Others</Text>
            <MaskedText
              style={styles.maskedTextCurrency}
              type='currency'
              options={{
                decimalSeparator: '.',
                groupSeparator: ',',
                precision: 2,
              }}>
              {numberToCurrency(splitBillStore.others)}
            </MaskedText>
          </View>
          <View style={styles.summaryView}>
            <Text>Total</Text>
            <CustomCurrencyTextInput
              style={styles.itemInputCurrency}
              containerStyle={{
                width: '40%',
              }}
              value={numberToCurrency(splitBillStore.total)}
              onChangeText={(currency) => {
                splitBillStore.setTotal(currencyToNumber(currency));
              }}
              textAlign='right'
            />
          </View>
          <Button
            mode='contained'
            buttonColor={COLOR.PRIMARY}
            style={{
              width: '90%',
              marginVertical: 20,
            }}
            onPress={() => navigation.navigate('SelectMembers')}>
            Confirm Bill
          </Button>
          <StatusBar style='auto' />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  itemInput: {
    width: '100%',
    height: 40,
    fontSize: 13,
  },
  itemInputCurrency: {
    width: '100%',
    height: 40,
    fontSize: 13,
    textAlign: 'right',
  },
  maskedTextCurrency: {
    height: 40,
    fontSize: 13,
    textAlignVertical: 'center',
    paddingRight: 15,
  },
  summaryView: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
