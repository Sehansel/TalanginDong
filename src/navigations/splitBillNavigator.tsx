import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { EditBillScreen } from 'src/screens/splitbill/editBill';
import { ScanReceiptScreen } from 'src/screens/splitbill/scanReceipt';
import { SelectMembersScreen } from 'src/screens/splitbill/selectMembers';

interface ISplitBillNavigator {}

export type SplitBillNavigatorParamList = {
  ScanReceipt: undefined;
  EditBill: undefined;
  SelectMembers: undefined;
};

const Stack = createStackNavigator<SplitBillNavigatorParamList>();

export const SplitBillNavigator: React.FC<ISplitBillNavigator> = function SplitBillNavigator(
  props,
) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='ScanReceipt'
        component={ScanReceiptScreen}
        options={{
          headerTitle: 'Scan Receipt',
        }}
      />
      <Stack.Screen
        name='EditBill'
        component={EditBillScreen}
        options={{
          headerTitle: 'Edit Bill',
        }}
      />
      <Stack.Screen
        name='SelectMembers'
        component={SelectMembersScreen}
        options={{
          headerTitle: 'Select Members',
        }}
      />
    </Stack.Navigator>
  );
};
