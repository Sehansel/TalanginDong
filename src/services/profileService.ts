import { API } from 'src/constants';
import { request } from 'src/utils/apiUtils';

export const getProfile = function getProfile() {
  return request({
    method: 'GET',
    url: `${API.TALANGIN_DONG_BASE_API}/v1/profile/get-profile`,
    useAuth: true,
  });
};
