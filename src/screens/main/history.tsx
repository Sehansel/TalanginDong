import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { MaskedText } from 'react-native-mask-text';
import { CustomAvatar } from 'src/components/customAvatar';
import { CustomRefreshControl } from 'src/components/customRefreshControl';
import * as BillService from 'src/services/billService';
import { COLOR } from 'src/theme';
import { numberToCurrency } from 'src/utils/currencyModifier';

interface IHistoryProps {}

export const HistoryScreen: React.FC<IHistoryProps> = observer(function HistoryScreen(props) {
  const [data, setData] = useState<any>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function getBill() {
    try {
      const response = await BillService.getBill();
      if (response.ok) {
        setData(response.data.data);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {}
  }

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        setRefreshing(true);
        await getBill();
        setRefreshing(false);
      })();
      return () => {};
    }, []),
  );

  return (
    <>
      <View style={styles.container}>
        <FlatList
          style={{
            flex: 1,
            width: '100%',
          }}
          data={data}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  width: '100%',
                  height: 140,
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: COLOR.PRIMARY,
                    width: '90%',
                    height: 120,
                    borderRadius: 15,
                    elevation: 4,
                    padding: 15,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 18,
                      fontWeight: 'bold',
                      width: '100%',
                    }}>
                    {item.billName}
                  </Text>
                  <View
                    style={{
                      width: '100%',
                    }}>
                    <MaskedText
                      style={{
                        color: 'white',
                        fontSize: 16,
                      }}
                      type='currency'
                      options={{
                        decimalSeparator: '.',
                        groupSeparator: ',',
                        precision: 2,
                      }}>
                      {numberToCurrency(item.total)}
                    </MaskedText>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      columnGap: 7,
                      marginTop: 10,
                    }}>
                    {item.members.map((member: any, index: number) => {
                      return (
                        <View key={index}>
                          <CustomAvatar label={member.username} size={30} />
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            );
          }}
          refreshControl={
            <CustomRefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await getBill();
                setRefreshing(false);
              }}
            />
          }
        />
        <StatusBar style='auto' />
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
