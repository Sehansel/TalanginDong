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
