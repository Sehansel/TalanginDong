import { observer } from 'mobx-react-lite';
import React from 'react';
import { RefreshControl } from 'react-native';
import { COLOR } from 'src/theme';

interface ICustomRefreshControlProps {
  refreshing: boolean;
  onRefresh?: (() => void) | undefined;
}

export const CustomRefreshControl: React.FC<ICustomRefreshControlProps> = observer(
  function CustomRefreshControl(props) {
    return <RefreshControl {...props} colors={[COLOR.PRIMARY]} />;
  },
);
