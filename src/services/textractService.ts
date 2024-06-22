import { request } from '../utils/apiUtils';

export const scanReceipt = function scanReceipt(imageBase64: string) {
  return request({
    method: 'POST',
    url: `https://talangindong-api.icarusphantom.dev/v1/textract/scan`,
    useAuth: true,
    data: {
      bytes: imageBase64,
    },
  });
};
