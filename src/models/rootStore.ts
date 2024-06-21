import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { AuthenticationStoreModel } from 'src/models/authenticationStore';
import { AddFriendsStoreModel } from 'src/models/friend/addFriendsStore';
import { FriendsStoreModel } from 'src/models/friend/friendsStore';
import { PendingStoreModel } from 'src/models/friend/pendingStore';

import { SplitBillStoreModel } from './splitBill/splitBillStore';

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model('RootStore').props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  friendsStore: types.optional(FriendsStoreModel, {
    friendList: [],
    isFirstLoaded: false,
    refreshing: false,
    isLoading: false,
    snackbar: '',
    dialog: {
      visible: false,
      id: '',
      username: '',
      status: '',
    },
  }),
  pendingStore: types.optional(PendingStoreModel, {
    pendingList: [],
    isFirstLoaded: false,
    refreshing: false,
    isLoading: false,
    buttonStatus: '0',
    currentId: '',
    snackbar: '',
  }),
  addFriendsStore: types.optional(AddFriendsStoreModel, {
    searchResultList: [],
    search: '',
    pastSearch: '',
    refreshing: false,
    isLoading: false,
    snackbar: '',
    dialog: {
      visible: false,
      id: '',
      username: '',
      status: '',
    },
  }),
  splitBillStore: types.optional(SplitBillStoreModel, {
    imageUri: undefined,
    imageBase64: undefined,
    billName: '',
    items: [],
    subtotal: 0,
    discount: 0,
    tax: 0,
    others: 0,
    total: 0,
    selectedFriends: [],
  }),
});

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
