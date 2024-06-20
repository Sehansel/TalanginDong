import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { FriendRequestStatus } from 'src/constants/misc';

export const TSearchResultList = types.model({
  id: types.string,
  username: types.string,
});

export const TDialog = types.model({
  visible: types.boolean,
  id: types.string,
  username: types.string,
  status: types.string,
});

export const AddFriendsStoreModel = types
  .model('AddFriendsStore')
  .props({
    searchResultList: types.optional(types.array(TSearchResultList), []),
    pastSearch: types.string,
    search: types.string,
    refreshing: types.boolean,
    isLoading: types.boolean,
    snackbar: types.string,
    dialog: TDialog,
  })
  .actions((store) => ({
    setSearch(value: string) {
      store.search = value;
    },
    setPastSearch(value: string) {
      store.pastSearch = value;
    },
    setSearchResultList(value: any) {
      store.searchResultList = value;
    },
    setIsLoading(state: boolean) {
      store.isLoading = state;
    },
    setRefreshing(state: boolean) {
      store.refreshing = state;
    },
    setSnackbar(value: string) {
      store.snackbar = value;
    },
    setDialog(id: string, username: string, status: FriendRequestStatus, visible?: boolean) {
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
  }));

export interface AddFriendsStore extends Instance<typeof AddFriendsStoreModel> {}
export interface AddFriendsStoreSnapshot extends SnapshotOut<typeof AddFriendsStoreModel> {}
