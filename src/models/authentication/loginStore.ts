import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const Tfield = types.model({
  value: types.string,
  errorText: types.string,
});

export const LoginStoreModel = types
  .model('LoginStore')
  .props({
    email: Tfield,
    password: Tfield,
    loading: types.boolean,
    snackbar: types.string,
  })
  .actions((store) => ({
    emailValidator() {
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(store.email.value)) {
        store.email.errorText = 'Email is invalid!';
      } else {
        store.email.errorText = '';
      }
    },
    passwordValidator() {
      if (store.password.value.length === 0) {
        store.password.errorText = 'Password is invalid!';
      } else {
        store.password.errorText = '';
      }
    },
    setEmail(text: string) {
      store.email.value = text;
      this.emailValidator();
      if (store.password.errorText !== '') {
        this.passwordValidator();
      }
    },
    setPassword(text: string) {
      store.password.value = text;
      this.passwordValidator();
      if (store.email.errorText !== '') {
        this.emailValidator();
      }
    },
    setIsInvalid() {
      store.email.errorText = 'Email is invalid!';
      store.password.errorText = 'Password is invalid!';
    },
    submitValidator() {
      this.emailValidator();
      this.passwordValidator();
    },
    setLoading(state: boolean) {
      store.loading = state;
    },
    setSnackbar(text: string) {
      store.snackbar = text;
    },
  }));

export interface LoginStore extends Instance<typeof LoginStoreModel> {}
export interface LoginStoreSnapshot extends SnapshotOut<typeof LoginStoreModel> {}
