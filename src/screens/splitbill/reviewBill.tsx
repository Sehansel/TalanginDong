import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaskedText } from 'react-native-mask-text';
import { Divider } from 'react-native-paper';
import { CustomAvatar } from 'src/components/customAvatar';
import { useStores } from 'src/models';
import { numberToCurrency } from 'src/utils/currencyModifier';

interface IReviewBillProps {}

export const ReviewBillScreen: React.FC<IReviewBillProps> = observer(
  function ReviewBillScreen(props) {
    const { billStore } = useStores();
    let billMembers: any = [
      {
        id: '',
        username: '',
        price: 0,
      },
    ];

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
          <Divider style={{ width: '90%' }} />
          {billMembers.map((member: any, index: number) => {
            return (
              <>
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
              </>
            );
          })}
          <Divider style={{ width: '90%' }} />
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
});
