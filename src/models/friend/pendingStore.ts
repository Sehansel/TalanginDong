import { Instance, SnapshotOut, cast, types } from 'mobx-state-tree';
import { FriendRemoveStatus, PendingButtonStatus } from 'src/constants/misc';

export const TData = types.model({
  id: types.string,
  username: types.string,
  status: types.number,
});

export const TPendingList = types.model({
  title: types.string,
  data: types.array(TData),
});

export const TDialog = types.model({
  visible: types.boolean,
  id: types.string,
  username: types.string,
  status: types.string,
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
    dialog: TDialog,
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
    setDialog(id: string, username: string, status: FriendRemoveStatus, visible?: boolean) {
      store.dialog.id = id;
      store.dialog.username = username;
      store.dialog.status = status;
      if (typeof visible === 'boolean') {
        store.dialog.visible = visible;
      }
    },
    setDialogVisible(state: boolean) {
      store.dialog.visible = state;
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
      store.dialog = {
        visible: false,
        id: '',
        username: '',
        status: '',
      };
    },
  }));

export interface PendingStore extends Instance<typeof PendingStoreModel> {}
export interface PendingStoreSnapshot extends SnapshotOut<typeof PendingStoreModel> {}
