import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaskedText } from 'react-native-mask-text';
import { Button, Divider } from 'react-native-paper';
import { CustomAvatar } from 'src/components/customAvatar';
import { useStores } from 'src/models';
import { AppNavigatorParamList } from 'src/navigations/appNavigator';
import * as BillService from 'src/services/billService';
import { COLOR } from 'src/theme';
import { numberToCurrency } from 'src/utils/currencyModifier';

interface IReviewBillProps {
  navigation: StackNavigationProp<AppNavigatorParamList>;
}

export const ReviewBillScreen: React.FC<IReviewBillProps> = observer(
  function ReviewBillScreen(props) {
    const { navigation } = props;
    const [isLoading, setLoading] = useState(false);
    const { billStore } = useStores();
    let billMembers: any = [
      {
        id: '',
        username: '',
        price: 0,
      },
    ];

    async function createBill() {
      try {
        const response = await BillService.createBill({
          billName: billStore.billName,
          items: billStore.items,
          subtotal: billStore.subtotal,
          discount: billStore.discount,
          tax: billStore.tax,
          others: billStore.others,
          total: billStore.total,
          members: billStore.members,
        });
        if (response.ok) {
          navigation.navigate('BottomTabNavigator');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error: any) {}
    }

    billMembers = [];

    for (const member of billStore.members) {
      let price = 0;
      for (const item of billStore.items) {
        if (item.members.find((value) => value.id === member.id)) {
          price += item.price / item.members.length;
        } else if (item.members.length === 0) {
          price += item.price / billStore.members.length;
        }
      }
      if (billStore.tax !== 0) {
        price += billStore.tax / billStore.members.length;
      }
      if (billStore.others > 0) {
        price += billStore.others / billStore.members.length;
      }
      billMembers.push({
        id: member.id,
        username: member.username,
        price,
      });
    }

    return (
      <>
        <View style={styles.container}>
          <Text
            style={{
              fontWeight: 'bold',
              marginVertical: 10,
              width: '90%',
              textAlign: 'center',
              fontSize: 18,
            }}>
            {billStore.billName}
          </Text>
          <Divider style={{ width: '90%' }} />
          {billMembers.map((member: any, index: number) => {
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignContent: 'flex-start',
                  gap: 10,
                  marginVertical: 10,
                  width: '90%',
                }}>
                <CustomAvatar size={50} label={member.username} />
                <View
                  style={{
                    width: '80%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{ fontWeight: 'bold' }}>{member.username}</Text>
                  <MaskedText
                    type='currency'
                    options={{
                      decimalSeparator: '.',
                      groupSeparator: ',',
                      precision: 2,
                    }}>
                    {numberToCurrency(member.price)}
                  </MaskedText>
                </View>
              </View>
            );
          })}
          <Divider style={{ width: '90%' }} />
          <Text style={{ fontWeight: 'bold', marginVertical: 10, textAlign: 'left', width: '90%' }}>
            Summary
          </Text>
          <Divider style={{ width: '90%' }} />
          <View style={styles.summaryItem}>
            <Text>Subtotal</Text>
            <MaskedText
              type='currency'
              options={{
                decimalSeparator: '.',
                groupSeparator: ',',
                precision: 2,
              }}>
              {numberToCurrency(billStore.subtotal)}
            </MaskedText>
          </View>
          <View style={styles.summaryItem}>
            <Text>Tax</Text>
            <MaskedText
              type='currency'
              options={{
                decimalSeparator: '.',
                groupSeparator: ',',
                precision: 2,
              }}>
              {numberToCurrency(billStore.tax)}
            </MaskedText>
          </View>
          <View style={styles.summaryItem}>
            <Text>Discount</Text>
            <MaskedText
              type='currency'
              options={{
                decimalSeparator: '.',
                groupSeparator: ',',
                precision: 2,
              }}>
              {numberToCurrency(billStore.discount)}
            </MaskedText>
          </View>
          <View style={styles.summaryItem}>
            <Text>Others</Text>
            <MaskedText
              type='currency'
              options={{
                decimalSeparator: '.',
                groupSeparator: ',',
                precision: 2,
              }}>
              {numberToCurrency(billStore.others)}
            </MaskedText>
          </View>
          <View style={styles.summaryItem}>
            <Text>Total</Text>
            <MaskedText
              type='currency'
              options={{
                decimalSeparator: '.',
                groupSeparator: ',',
                precision: 2,
              }}>
              {numberToCurrency(billStore.total)}
            </MaskedText>
          </View>
          <Button
            mode='contained'
            buttonColor={COLOR.PRIMARY}
            style={{
              marginTop: 10,
              width: '90%',
            }}
            onPress={async () => {
              setLoading(true);
              await createBill();
              setLoading(false);
            }}
            loading={isLoading}>
            Send Bill
          </Button>
          <StatusBar style='auto' />
        </View>
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  summaryItem: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
});
