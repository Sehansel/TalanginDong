import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { AuthenticationStoreModel } from 'src/models/authenticationStore';

import { FriendsStoreModel } from './friend/friendsStore';

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
});

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
