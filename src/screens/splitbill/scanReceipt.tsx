import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Dialog, Icon, Portal, Snackbar } from 'react-native-paper';
import { useStores } from 'src/models';
import { ScanReceiptStoreModel } from 'src/models/splitBill/scanReceiptStore';
import { SplitBillNavigatorParamList } from 'src/navigations/splitBillNavigator';
import * as TextractService from 'src/services/textractService';
import { COLOR } from 'src/theme';
import { isNetworkError } from 'src/utils/apiUtils';

interface IScanReceiptProps {
  navigation: StackNavigationProp<SplitBillNavigatorParamList>;
}

export const ScanReceiptScreen: React.FC<IScanReceiptProps> = observer(
  function ScanReceiptScreen(props) {
    const { navigation } = props;
    const { splitBillStore } = useStores();
    const scanReceiptStore = useLocalObservable(() =>
      ScanReceiptStoreModel.create({
        dialog: true,
        isLoading: false,
        snackbar: '',
      }),
    );
    const [, requestCameraPermission] = ImagePicker.useCameraPermissions();
    const [, requestMediaLibraryPermission] = ImagePicker.useMediaLibraryPermissions();

    async function takePhoto() {
      const permission = await requestCameraPermission();
      if (permission.granted) {
        const image = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          base64: true,
          aspect: [9, 16],
        });
        scanReceiptStore.setDialog(false);
        if (!image.canceled && image.assets[0] && image.assets[0].base64) {
          splitBillStore.setImage(image.assets[0].uri, image.assets[0].base64);
        }
      }
    }

    async function selectFromGallery() {
      const permission = await requestMediaLibraryPermission();
      if (permission.granted) {
        const image = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          base64: true,
          aspect: [9, 16],
        });
        scanReceiptStore.setDialog(false);
        if (!image.canceled && image.assets[0] && image.assets[0].base64) {
          splitBillStore.setImage(image.assets[0].uri, image.assets[0].base64);
        }
      }
    }

    async function scanReceipt() {
      if (!splitBillStore.imageUri || !splitBillStore.imageBase64) {
        scanReceiptStore.setSnackbar('Please select photo first!');
        return;
      }
      try {
        const response = await TextractService.scanReceipt(splitBillStore.imageBase64);
        if (response.ok) {
          const items = [];
          for (const item of response.data?.data?.items ?? []) {
            items.push({
              item: item.item,
              quantity: item.quantity,
              price: item.price,
              pricePerItem: item.price / item.quantity,
              members: [],
            });
          }
          splitBillStore.setItems(items);
          splitBillStore.setDiscount(response.data?.data?.summary?.discount ?? 0);
          splitBillStore.setTax(response.data?.data?.summary?.tax ?? 0);
          splitBillStore.setTotal(response.data?.data?.summary?.total ?? 0);
          navigation.navigate('EditBill');
        } else if (isNetworkError(response.problem)) {
          scanReceiptStore.setSnackbar('Please check your network connection before continue!');
        } else {
          scanReceiptStore.setSnackbar('Unknown error occured!');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.log(error);
        scanReceiptStore.setSnackbar('Unknown error occured!');
      }
    }

    return (
      <>
        <View style={styles.container}>
          {splitBillStore.imageUri ? (
            <Image
              style={{
                width: '80%',
                height: '80%',
              }}
              source={{
                uri: splitBillStore.imageUri,
              }}
            />
          ) : (
            <View
              style={{
                width: '80%',
                height: '80%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon size={200} source='image' color='grey' />
            </View>
          )}
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              columnGap: 20,
            }}>
            <Button
              mode='contained'
              icon='camera-retake'
              style={styles.button}
              onPress={() => scanReceiptStore.setDialog(true)}>
              Retake Photo
            </Button>
            <Button
              mode='contained'
              icon='check-bold'
              style={styles.button}
              buttonColor={COLOR.PRIMARY}
              onPress={async () => {
                scanReceiptStore.setIsLoading(true);
                await scanReceipt();
                scanReceiptStore.setIsLoading(false);
              }}
              loading={scanReceiptStore.isLoading}>
              Confirm Photo
            </Button>
          </View>
          <Portal>
            <Dialog
              visible={scanReceiptStore.dialog}
              onDismiss={() => scanReceiptStore.setDialog(false)}
              theme={{
                colors: {
                  elevation: {
                    level3: 'white',
                  },
                },
              }}
              style={{
                width: 250,
                alignSelf: 'center',
              }}>
              <Dialog.Actions
                style={{
                  flexDirection: 'column',
                  rowGap: 30,
                }}>
                <Button
                  icon='camera'
                  mode='outlined'
                  style={styles.modalButton}
                  textColor='black'
                  onPress={takePhoto}>
                  Take Photo
                </Button>
                <Button
                  icon='image-multiple'
                  mode='outlined'
                  style={styles.modalButton}
                  textColor='black'
                  onPress={selectFromGallery}>
                  Select from Gallery
                </Button>
              </Dialog.Actions>
            </Dialog>
            <Snackbar
              visible={!(!scanReceiptStore.snackbar || scanReceiptStore.snackbar === '')}
              onDismiss={() => scanReceiptStore.setSnackbar('')}
              action={{
                label: 'Ok',
              }}
              theme={{ colors: { inversePrimary: COLOR.PRIMARY } }}>
              {scanReceiptStore.snackbar}
            </Snackbar>
          </Portal>
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
    justifyContent: 'center',
  },
  modalButton: {
    width: 180,
  },
  button: {
    width: 150,
  },
});
