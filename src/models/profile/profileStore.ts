import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const ProfileStoreModel = types
  .model('ProfileStore')
  .props({
    username: types.maybe(types.string),
    snackbar: types.string,
  })
  .actions((store) => ({
    setUsername(value?: string) {
      store.username = value;
    },
    setSnackbar(value: string) {
      store.snackbar = value;
    },
    reset() {
      store.username = undefined;
      store.snackbar = '';
    },
  }));

export interface ProfileStore extends Instance<typeof ProfileStoreModel> {}
export interface ProfileStoreSnapshot extends SnapshotOut<typeof ProfileStoreModel> {}
