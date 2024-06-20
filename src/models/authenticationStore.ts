import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const AuthenticationStoreModel = types
  .model('AuthenticationStore')
  .props({
    authToken: types.maybe(types.string),
    authRefreshToken: types.maybe(types.string),
  })
  .views((store) => ({
    get token() {
      return store.authToken;
    },
    get refreshToken() {
      return store.authRefreshToken;
    },
    get isAuthenticated() {
      return !!store.authToken && !!store.authRefreshToken;
    },
  }))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value;
    },
    setAuthRefreshToken(value?: string) {
      store.authRefreshToken = value;
    },
    setBothAuthToken(authToken?: string, authRefreshToken?: string) {
      store.authToken = authToken;
      store.authRefreshToken = authRefreshToken;
    },
    logout() {
      store.authToken = undefined;
      store.authRefreshToken = undefined;
    },
    reset() {
      store.authToken = undefined;
      store.authRefreshToken = undefined;
    },
  }));

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
