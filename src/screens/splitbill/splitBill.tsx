import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions, SectionList } from 'react-native';
import { MaskedText } from 'react-native-mask-text';
import { Button, Dialog, Divider, IconButton, Portal } from 'react-native-paper';
import { CustomAvatar } from 'src/components/customAvatar';
import { useStores } from 'src/models';
import { SplitBillStoreModel } from 'src/models/splitBill/splitBillStore';
import { SplitBillNavigatorParamList } from 'src/navigations/splitBillNavigator';
import { COLOR } from 'src/theme';
import { numberToCurrency } from 'src/utils/currencyModifier';

interface ISplitBillProps {
  navigation: StackNavigationProp<SplitBillNavigatorParamList>;
}

export const SplitBillScreen: React.FC<ISplitBillProps> = observer(function SplitBillScreen(props) {
  const { navigation } = props;
  const { billStore } = useStores();
  const splitBillStore = useLocalObservable(() =>
    SplitBillStoreModel.create({
      dialog: false,
      currentIndex: undefined,
      isLoading: false,
      snackbar: '',
    }),
  );

  const itemMembersData: any = [];

  if (splitBillStore.currentIndex !== undefined) {
    if (billStore.items[splitBillStore.currentIndex].members.length > 0) {
      itemMembersData.push({
        title: 'Members',
        data: billStore.items[splitBillStore.currentIndex].members,
      });
    }
  }
  const selectedItemMembersIdList =
    splitBillStore.currentIndex !== undefined
      ? billStore.items[splitBillStore.currentIndex].members.map((value) => value.id)
      : [];
  if (selectedItemMembersIdList.length !== billStore.members.length) {
    itemMembersData.push({
      title: 'Add More',
      data: billStore.members.filter((value) => !selectedItemMembersIdList.includes(value.id)),
    });
  }

  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              marginVertical: 20,
            }}>
            {billStore.billName}
          </Text>
          {billStore.items.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  width: '90%',
                }}>
                <Divider style={{ marginBottom: 6 }} />
                <Text style={{ fontWeight: 'bold' }}>{item.item}</Text>
                <MaskedText
                  type='currency'
                  options={{
                    decimalSeparator: '.',
                    groupSeparator: ',',
                    precision: 2,
                  }}>
                  {numberToCurrency(item.price)}
                </MaskedText>
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    rowGap: 30,
                  }}>
                  {item.members.map((member, memberIndex) => {
                    return (
                      <View
                        key={memberIndex}
                        style={{
                          marginRight: 10,
                        }}>
                        <CustomAvatar size={35} label={member.username} />
                      </View>
                    );
                  })}
                </View>
                <Button
                  style={{
                    alignSelf: 'flex-start',
                    marginLeft: -12,
                  }}
                  textColor={COLOR.PRIMARY}
                  onPress={() => {
                    splitBillStore.setCurrentIndex(index);
                    splitBillStore.setDialog(true);
                  }}>
                  Add Members
                </Button>
              </View>
            );
          })}
          <Divider
            style={{
              width: '90%',
            }}
          />
          <Button
            mode='contained'
            buttonColor={COLOR.PRIMARY}
            style={{
              width: '90%',
              marginTop: 10,
            }}
            onPress={() => navigation.navigate('ReviewBill')}>
            Confirm Split Bill
          </Button>
          <Portal>
            <Dialog
              visible={splitBillStore.dialog}
              onDismiss={() => {
                splitBillStore.setDialog(false);
                setTimeout(() => {
                  splitBillStore.setCurrentIndex(undefined);
                }, 200);
              }}
              theme={{
                colors: {
                  elevation: {
                    level3: 'white',
                  },
                },
              }}>
              <Dialog.Content>
                <SectionList
                  sections={itemMembersData}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 20,
                      }}>
                      <CustomAvatar label={item.username} size={50} />
                      <Text style={styles.usernameItem}>{item.username}</Text>
                      {!selectedItemMembersIdList.includes(item.id) ? (
                        <IconButton
                          icon='account-plus-outline'
                          iconColor={COLOR.PRIMARY}
                          onPress={() => {
                            if (splitBillStore.currentIndex !== undefined) {
                              billStore.addItemMembers(
                                item.id,
                                item.username,
                                splitBillStore.currentIndex,
                              );
                            }
                          }}
                        />
                      ) : (
                        <IconButton
                          icon='account-minus-outline'
                          iconColor='red'
                          onPress={() => {
                            if (splitBillStore.currentIndex !== undefined) {
                              billStore.removeItemMembers(item.id, splitBillStore.currentIndex);
                            }
                          }}
                        />
                      )}
                    </View>
                  )}
                  renderSectionHeader={({ section }) => (
                    <View
                      style={{
                        flexDirection: 'column',
                        width: '100%',
                      }}>
                      <Text style={styles.usernameTitle}>{section.title}</Text>
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                  ItemSeparatorComponent={() => <Divider />}
                  stickySectionHeadersEnabled
                  style={styles.section}
                  ListEmptyComponent={
                    <View
                      style={{
                        height: Dimensions.get('screen').height / 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          opacity: 0.5,
                        }}>
                        You don't have friends...
                      </Text>
                    </View>
                  }
                />
                <Dialog.Actions>
                  <Button
                    mode='contained'
                    buttonColor={COLOR.PRIMARY}
                    style={{
                      width: 100,
                    }}
                    onPress={() => {
                      splitBillStore.setDialog(false);
                      setTimeout(() => {
                        splitBillStore.setCurrentIndex(undefined);
                      }, 200);
                    }}>
                    Confirm
                  </Button>
                </Dialog.Actions>
              </Dialog.Content>
            </Dialog>
          </Portal>
          <StatusBar style='auto' />
        </View>
      </ScrollView>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  section: {
    width: '100%',
  },
  usernameItem: {
    padding: 15,
    marginVertical: 15,
    fontSize: 16,
    fontWeight: 'bold',
    width: '60%',
  },
  usernameTitle: {
    backgroundColor: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
});
