import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const SplitBillStoreModel = types
  .model('SplitBillStore')
  .props({
    dialog: types.boolean,
    currentIndex: types.maybe(types.number),
    isLoading: types.boolean,
    snackbar: types.string,
  })
  .actions((store) => ({
    setDialog(state: boolean) {
      store.dialog = state;
    },
    setCurrentIndex(value?: number) {
      store.currentIndex = value;
    },
    setIsLoading(state: boolean) {
      store.isLoading = state;
    },
    setSnackbar(value: string) {
      store.snackbar = value;
    },
    reset() {
      store.dialog = false;
      store.isLoading = false;
      store.snackbar = '';
    },
  }));

export interface SplitBillStore extends Instance<typeof SplitBillStoreModel> {}
export interface SplitBillSnapshot extends SnapshotOut<typeof SplitBillStoreModel> {}
