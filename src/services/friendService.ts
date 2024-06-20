import { API } from 'src/constants';
import { request } from 'src/utils/apiUtils';

export const list = function list() {
  return request({
    method: 'GET',
    url: `${API.TALANGIN_DONG_BASE_API}/v1/friend/list`,
    useAuth: true,
  });
};

export const remove = function remove(friendId: string) {
  return request({
    method: 'DELETE',
    url: `${API.TALANGIN_DONG_BASE_API}/v1/friend/remove`,
    useAuth: true,
    data: {
      friendId,
    },
  });
};

export const pending = function pending() {
  return request({
    method: 'GET',
    url: `${API.TALANGIN_DONG_BASE_API}/v1/friend/pending`,
    useAuth: true,
  });
};

export const cancel = function cancel(recipientId: string) {
  return request({
    method: 'DELETE',
    url: `${API.TALANGIN_DONG_BASE_API}/v1/friend/cancel`,
    useAuth: true,
    data: {
      recipientId,
    },
  });
};

export const reject = function reject(requesterId: string) {
  return request({
    method: 'DELETE',
    url: `${API.TALANGIN_DONG_BASE_API}/v1/friend/reject`,
    useAuth: true,
    data: {
      requesterId,
    },
  });
};

export const accept = function accept(requesterId: string) {
  return request({
    method: 'PUT',
    url: `${API.TALANGIN_DONG_BASE_API}/v1/friend/accept`,
    useAuth: true,
    data: {
      requesterId,
    },
  });
};

export const search = function search(search: string) {
  return request({
    method: 'GET',
    url: `${API.TALANGIN_DONG_BASE_API}/v1/friend/search?search=${search}`,
    useAuth: true,
  });
};

export const requestFriend = function requestFriend(recipientId: string) {
  return request({
    method: 'POST',
    url: `${API.TALANGIN_DONG_BASE_API}/v1/friend/request`,
    useAuth: true,
    data: {
      recipientId,
    },
  });
};
