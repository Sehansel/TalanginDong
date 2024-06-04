import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const Tfield = types.model({
  value: types.string,
  errorText: types.string,
});

export const RegisterStoreModel = types
  .model('RegisterStore')
  .props({
    username: Tfield,
    email: Tfield,
    password: Tfield,
    confirmPassword: Tfield,
    isChecked: types.boolean,
    loading: types.boolean,
    snackbar: types.string,
    dialog: types.boolean,
  })
  .actions((store) => ({
    usernameValidator() {
      if (store.username.value === '') {
        store.username.errorText = "store field can't be empty";
      } else if (store.username.value.length < 3) {
        store.username.errorText = 'Must be alteast 3 characters!';
      } else if (!/^\w+$/.test(store.username.value)) {
        store.username.errorText = 'Must be alphanumeric!';
      } else {
        store.username.errorText = '';
      }
    },
    emailValidator() {
      if (store.email.value === '') {
        store.email.errorText = "store field can't be empty";
      } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(store.email.value)) {
        store.email.errorText = 'Email is invalid!';
      } else {
        store.email.errorText = '';
      }
    },
    passwordValidator() {
      if (store.password.value === '') {
        store.password.errorText = "store field can't be empty";
      } else if (store.password.value.length < 8) {
        store.password.errorText = 'Must be atleast 8 characters!';
      } else if (!/[A-Z]/.test(store.password.value) || !/[a-z]/.test(store.password.value)) {
        store.password.errorText = 'Must include lowercase and uppercase letter!';
      } else if (!/[0-9]/.test(store.password.value)) {
        store.password.errorText = 'Must include number!';
      } else {
        store.password.errorText = '';
      }
    },
    confirmPasswordValidator() {
      if (store.confirmPassword.value === '') {
        store.confirmPassword.errorText = "store field can't be empty";
      } else if (store.password.value !== store.confirmPassword.value) {
        store.confirmPassword.errorText = "Password doesn't match!";
      } else {
        store.confirmPassword.errorText = '';
      }
    },
    setUsername(text: string) {
      store.username.value = text;
      this.usernameValidator();
    },
    setEmail(text: string) {
      store.email.value = text;
      this.emailValidator();
    },
    setPassword(text: string) {
      store.password.value = text;
      this.passwordValidator();
    },
    setConfirmPassword(text: string) {
      store.confirmPassword.value = text;
      this.confirmPasswordValidator();
    },
    setIsChecked(state: boolean) {
      store.isChecked = state;
    },
    setLoading(state: boolean) {
      store.loading = state;
    },
    setSnackbar(text: string) {
      store.snackbar = text;
    },
    setDialog(state: boolean) {
      store.dialog = state;
    },
    setUsernameAlreadyExist() {
      store.username.errorText = 'Username already exist!';
    },
    setEmailAlreadyExist() {
      store.email.errorText = 'Email already exist!';
    },
    submitValidator() {
      this.usernameValidator();
      this.emailValidator();
      this.passwordValidator();
      this.confirmPasswordValidator();
    },
  }));

export interface RegisterStore extends Instance<typeof RegisterStoreModel> {}
export interface RegisterStoreSnapshot extends SnapshotOut<typeof RegisterStoreModel> {}
