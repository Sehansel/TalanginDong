export enum FriendRemoveStatus {
  NOT_REMOVING = '',
  ASK_CONFIRMATION = 'ASK_CONFIRMATION',
  REMOVING = 'removing',
  REMOVED = 'removed',
}

export enum FriendRequestStatus {
  NOT_REQUESTING = '',
  ASK_CONFIRMATION = 'ASK_CONFIRMATION',
  REQUESTING = 'requesting',
  REQUESTED = 'requested',
}

export enum PendingButtonStatus {
  IDLE = '0',
  ACCEPT = '1',
  REJECT = '2',
  CANCEL = '3',
  DONE = '4',
}
