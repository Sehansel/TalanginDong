import type { NativeStackNavigationProps } from '@react-navigation/native-stack';

export type HomeStackNavigationParamList={
    Login:undefined;
    Register:undefined;
};

export type HomeScreenNavigationProp=NativeStackNavigationProps<
Login,
Register
>;



