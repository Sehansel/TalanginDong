import { API } from 'src/constants';
import { request } from 'src/utils/apiUtils';

export const scanReceipt = function scanReceipt(imageBase64: string) {
  return request({
    method: 'POST',
    url: `${API.TALANGIN_DONG_BASE_API}/v1/textract/scan`,
    useAuth: true,
    data: {
      bytes: imageBase64,
    },
  });
};
