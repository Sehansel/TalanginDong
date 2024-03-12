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

interface ScannedData {
  data: {
    items: {item: string; quantity: number; price: number}[];
    summary: {
      subtotal: number;
      tax: number;
      discount: number;
      serviceCharge: number;
      total: number;
    };
  };
}

function ScanReceipt(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const backgroundStyle = {
    flex: 1,
    backgroundColor: 'white',
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [numberOfPeople, setNumberOfPeople] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem('scanData');
        if (data !== null) {
          setScannedData(JSON.parse(data));
        }
        console.log(data);
      } catch (error: any) {
        console.error('Error fetching data from AsyncStorage:', error.message);
      }
    };

    const getNumberOfPeople = async () => {
      try {
        const numberPeopleString = await AsyncStorage.getItem('numberOfPeople');

        if (numberPeopleString !== null) {
          const numberPeople = JSON.parse(numberPeopleString);
          setNumberOfPeople(numberPeople);
          console.log(numberPeople);
        }
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
      }
    };

    getNumberOfPeople();
    fetchData();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>Overview</Text>
          <Text style={styles.subTitleText}>
            Here is the amount needed to be payed by each person
          </Text>
        </View>
      </View>
      <View style={styles.separator} />
      {scannedData && (
        <View style={styles.scrollView}>
          <Text style={styles.text}>
            Before Tax: Rp.{formatPrice(scannedData.data.summary.subtotal)}
          </Text>
          <Text style={styles.text}>
            Tax: Rp.{formatPrice(scannedData.data.summary.tax)}
          </Text>
          <Text style={styles.text}>
            Service Charge: Rp.{formatPrice(scannedData.data.summary.serviceCharge)}
          </Text>
          <Text style={styles.text}>
            Total: Rp.{formatPrice(scannedData.data.summary.total)}
          </Text>

          {numberOfPeople !== '' && (
            <Text style={styles.text}>
              Amount Owed Per Person: Rp.
              {formatPrice(scannedData.data.summary.total / numberOfPeople)}
            </Text>
          )}
        </View>
      )}
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Finish</Text>
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
  text: {
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
    marginTop: '10%',
    fontWeight: 'bold',
  },
});

export default ScanReceipt;
