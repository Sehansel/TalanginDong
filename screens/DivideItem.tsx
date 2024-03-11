import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProp} from '../type';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ScanReceipt(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const backgroundStyle = {
    flex: 1,
    backgroundColor: 'white',
  };

  const [scannedData, setScannedData] = useState<{
    data: {items: {item: string; price: number}[]};
  } | null>(null);

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem('scanData');
        if (data) {
          setScannedData(JSON.parse(data));
        }
        if (!data) {
          console.log('Cannot get data');
        }
      } catch (error: any) {
        console.error('Error retrieving data', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>Split Bill</Text>
          <Text style={styles.subTitleText}>
            Here is an overview of all the products we found on the receipt
          </Text>
        </View>
        <View style={styles.tableHeaderContainer}>
          <Text style={(styles.tableHeader, styles.productColumn)}>
            Product
          </Text>
          <Text style={(styles.tableHeader, styles.otherColumn)}>Edit</Text>
          <Text style={(styles.tableHeader, styles.otherColumn)}>Delete</Text>
        </View>
      </View>
      <View style={styles.separator} />
      <ScrollView style={styles.scrollView}>
        {scannedData && scannedData.data.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.productColumn}>
                <Text style={styles.tableData}>{item.item}</Text>
                <Text style={styles.price}>Rp.{formatPrice(item.price)}</Text>
              </View>
              <Image
                source={require('../image/edit.jpg')}
                style={[styles.editDeleteButton, styles.otherColumn]}
              />
              <Image
                source={require('../image/delete.jpg')}
                style={[styles.editDeleteButton, styles.otherColumn]}
              />
            </View>
          ))}
      </ScrollView>
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ViewItem')}>
          <Text style={styles.buttonText}>Divide Bill</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image
              source={require('../image/logo.png')}
              style={styles.bottomImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  textContainer: {
    marginTop: '5%',
    marginBottom: 5,
  },
  titleText: {
    fontSize: 35,
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'black',
  },
  subTitleText: {
    marginTop: '2%',
    fontSize: 15,
    color: 'black',
  },
  tableHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 10,
  },
  scrollView: {
    flexGrow: 1,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  productColumn: {
    flex: 3,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  otherColumn: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  editDeleteButton: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  tableData: {
    fontSize: 23,
    color: 'black',
  },
  price: {
    fontSize: 15,
    color: 'gray',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c2dc7',
    paddingHorizontal: 20,
    paddingVertical: 15,
    bottom: 0,
  },
  bottomImage: {
    width: 50,
    height: 50,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: '5%',
    marginHorizontal: '5%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ScanReceipt;
