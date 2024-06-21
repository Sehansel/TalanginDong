import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const TFriend = types.model({
  id: types.string,
  username: types.string,
});

export const SelectMemberStoreModel = types
  .model('SelectMemberStore')
  .props({
    friendList: types.optional(types.array(TFriend), []),
    searchResultList: types.optional(types.array(TFriend), []),
    search: types.string,
    refreshing: types.boolean,
    isLoading: types.boolean,
    snackbar: types.string,
  })
  .actions((store) => ({
    setFriends(value: any) {
      store.friendList = value;
    },
    setSearch(value: string) {
      store.search = value;
    },
    setRefreshing(state: boolean) {
      store.refreshing = state;
    },
    setIsLoading(state: boolean) {
      store.isLoading = state;
    },
    setSnackbar(value: string) {
      store.snackbar = value;
    },
    reset() {
      store.isLoading = false;
      store.snackbar = '';
    },
  }));

export interface SelectMemberStore extends Instance<typeof SelectMemberStoreModel> {}
export interface SelectMemberSnapshot extends SnapshotOut<typeof SelectMemberStoreModel> {}
