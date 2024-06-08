import { Instance, SnapshotOut, cast, types } from 'mobx-state-tree';
import { FriendRemoveStatus } from 'src/constants/misc';

export const TData = types.model({
  id: types.string,
  username: types.string,
});

export const TFriendList = types.model({
  title: types.string,
  data: types.array(TData),
});

export const TDialog = types.model({
  visible: types.boolean,
  id: types.string,
  username: types.string,
  status: types.string,
});

export const FriendsStoreModel = types
  .model('FriendsStore')
  .props({
    friendList: types.optional(types.array(TFriendList), []),
    isFirstLoaded: types.boolean,
    refreshing: types.boolean,
    isLoading: types.boolean,
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
    setFriends(value: any) {
      store.friendList = value;
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
      store.friendList = cast([]);
      store.isFirstLoaded = false;
      store.refreshing = false;
      store.isLoading = false;
      store.snackbar = '';
      store.dialog = {
        visible: false,
        id: '',
        username: '',
        status: '',
      };
    },
  }));

export interface FriendsStore extends Instance<typeof FriendsStoreModel> {}
export interface FriendsStoreSnapshot extends SnapshotOut<typeof FriendsStoreModel> {}
