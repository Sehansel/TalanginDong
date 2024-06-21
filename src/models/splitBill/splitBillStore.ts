import { Instance, SnapshotOut, cast, types } from 'mobx-state-tree';

export const TFriends = types.model({
  id: types.string,
  username: types.string,
});

export const TItems = types.model({
  item: types.string,
  quantity: types.number,
  price: types.integer,
  members: types.optional(types.array(TFriends), []),
});

export const SplitBillStoreModel = types
  .model('SplitBillStore')
  .props({
    imageUri: types.maybe(types.string),
    imageBase64: types.maybe(types.string),
    items: types.optional(types.array(TItems), []),
    subtotal: types.integer,
    discount: types.integer,
    tax: types.integer,
    others: types.integer,
    total: types.integer,
    selectedFriends: types.optional(types.array(TFriends), []),
  })
  .actions((store) => ({
    setImage(Uri: string, base64: string) {
      store.imageUri = Uri;
      store.imageBase64 = base64;
    },
    setItems(value: any) {
      store.items = value;
    },
    setSubtotal(value: number) {
      store.subtotal = value;
    },
    setDiscount(value: number) {
      store.discount = value;
    },
    setTax(value: number) {
      store.tax = value;
    },
    setOthers(value: number) {
      store.others = value;
    },
    setTotal(value: number) {
      store.total = value;
    },
    setSelectedFriends(value: any) {
      store.selectedFriends = value;
    },
    reset() {
      store.imageUri = undefined;
      store.imageBase64 = undefined;
      store.items = cast([]);
      store.subtotal = 0;
      store.discount = 0;
      store.tax = 0;
      store.others = 0;
      store.total = 0;
      store.selectedFriends = cast([]);
    },
  }));

export interface SplitBillStore extends Instance<typeof SplitBillStoreModel> {}
export interface SplitBillSnapshot extends SnapshotOut<typeof SplitBillStoreModel> {}
