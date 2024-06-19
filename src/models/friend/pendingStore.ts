import { Instance, SnapshotOut, cast, types } from 'mobx-state-tree';
import { PendingButtonStatus } from 'src/constants/misc';

export const TData = types.model({
  id: types.string,
  username: types.string,
  status: types.number,
});

export const TPendingList = types.model({
  title: types.string,
  data: types.array(TData),
});

export const PendingStoreModel = types
  .model('PendingStore')
  .props({
    pendingList: types.optional(types.array(TPendingList), []),
    isFirstLoaded: types.boolean,
    refreshing: types.boolean,
    isLoading: types.boolean,
    buttonStatus: types.string,
    currentId: types.string,
    snackbar: types.string,
  })
  .actions((store) => ({
    setIsLoading(state: boolean) {
      store.isLoading = state;
    },
    setRefreshing(state: boolean) {
      store.refreshing = state;
    },
    setPending(value: any) {
      store.pendingList = value;
    },
    setButtonStatus(id: string, status: PendingButtonStatus) {
      store.currentId = id;
      store.buttonStatus = status;
    },
    setSnackbar(value: string) {
      store.snackbar = value;
    },
    setFirstLoaded(state: boolean) {
      store.isFirstLoaded = state;
    },
    reset() {
      store.pendingList = cast([]);
      store.isFirstLoaded = false;
      store.refreshing = false;
      store.isLoading = false;
      store.buttonStatus = '0';
      store.currentId = '';
      store.snackbar = '';
    },
  }));

export interface PendingStore extends Instance<typeof PendingStoreModel> {}
export interface PendingStoreSnapshot extends SnapshotOut<typeof PendingStoreModel> {}
