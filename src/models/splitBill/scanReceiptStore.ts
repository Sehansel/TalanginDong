import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const ScanReceiptStoreModel = types
  .model('ScanReceiptStore')
  .props({
    dialog: types.boolean,
    isLoading: types.boolean,
    snackbar: types.string,
  })
  .actions((store) => ({
    setDialog(state: boolean) {
      store.dialog = state;
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

export interface ScanReceiptStore extends Instance<typeof ScanReceiptStoreModel> {}
export interface ScanReceiptSnapshot extends SnapshotOut<typeof ScanReceiptStoreModel> {}
