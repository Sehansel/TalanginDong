import { Instance, SnapshotOut, cast, types } from 'mobx-state-tree';

export const TFriends = types.model({
  id: types.string,
  username: types.string,
});

export const TItems = types.model({
  item: types.string,
  quantity: types.integer,
  price: types.number,
  pricePerItem: types.number,
  members: types.optional(types.array(TFriends), []),
});

export const SplitBillStoreModel = types
  .model('SplitBillStore')
  .props({
    imageUri: types.maybe(types.string),
    imageBase64: types.maybe(types.string),
    billName: types.string,
    items: types.optional(types.array(TItems), []),
    subtotal: types.number,
    discount: types.number,
    tax: types.number,
    others: types.number,
    total: types.number,
    members: types.optional(types.array(TFriends), []),
  })
  .actions((store) => ({
    setImage(Uri: string, base64: string) {
      store.imageUri = Uri;
      store.imageBase64 = base64;
    },
    setBillName(value: string) {
      store.billName = value;
    },
    calculateSubtotalAndOthers() {
      let subtotal = 0;
      for (const item of store.items) {
        subtotal += item.price;
      }
      store.subtotal = subtotal;
      store.others = store.total - (store.subtotal + store.tax - store.discount);
    },
    setItems(value: any) {
      store.items = value;
      this.calculateSubtotalAndOthers();
    },
    setItem(value: any, index: number) {
      if (value.item) {
        store.items[index].item = value.item;
      }
      if (value.quantity) {
        store.items[index].quantity = value.quantity;
      }
      if (value.price) {
        store.items[index].price = value.price;
      }
      if (value.pricePerItem) {
        store.items[index].pricePerItem = value.pricePerItem;
      }
      if (value.members) {
        store.items[index].members = value.members;
      }
      this.calculateSubtotalAndOthers();
    },
    createItem() {
      store.items.push({
        item: '',
        quantity: 0,
        price: 0,
        pricePerItem: 0,
        members: [],
      });
    },
    setDiscount(value: number) {
      store.discount = value;
      this.calculateSubtotalAndOthers();
    },
    setTax(value: number) {
      store.tax = value;
      this.calculateSubtotalAndOthers();
    },
    setTotal(value: number) {
      store.total = value;
      this.calculateSubtotalAndOthers();
    },
    setMembers(value: any) {
      store.members = value;
    },
    addMembers(id: string, username: string) {
      if (!store.members.find((member) => member.id === id)) {
        store.members.push({
          id,
          username,
        });
      }
    },
    removeMembers(id: string) {
      const newMembers: any = store.members.filter((member) => member.id !== id);
      store.members = newMembers;
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
      store.members = cast([]);
    },
  }));

export interface SplitBillStore extends Instance<typeof SplitBillStoreModel> {}
export interface SplitBillSnapshot extends SnapshotOut<typeof SplitBillStoreModel> {}
