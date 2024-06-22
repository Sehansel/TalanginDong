import { API } from 'src/constants';
import { request } from 'src/utils/apiUtils';

export const createBill = function createBill(data: any) {
  return request({
    method: 'POST',
    url: `${API.TALANGIN_DONG_BASE_API}/v1/bill/create`,
    useAuth: true,
    data,
  });
};

export const getBill = function getBill() {
  return request({
    method: 'GET',
    url: `${API.TALANGIN_DONG_BASE_API}/v1/bill/get`,
    useAuth: true,
  });
};
