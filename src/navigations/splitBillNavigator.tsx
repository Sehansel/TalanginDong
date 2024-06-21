import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { EditBillScreen } from 'src/screens/splitbill/editBill';
import { ScanReceiptScreen } from 'src/screens/splitbill/scanReceipt';

interface ISplitBillNavigator {}

export type SplitBillNavigatorParamList = {
  ScanReceipt: undefined;
  EditBill: undefined;
};

const Stack = createStackNavigator<SplitBillNavigatorParamList>();

export const SplitBillNavigator: React.FC<ISplitBillNavigator> = function SplitBillNavigator(
  props,
) {
  return (
    <Stack.Navigator>
      <Stack.Screen name='ScanReceipt' component={ScanReceiptScreen} />
      <Stack.Screen name='EditBill' component={EditBillScreen} />
    </Stack.Navigator>
  );
};
