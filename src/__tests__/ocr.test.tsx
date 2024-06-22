import { scanReceipt } from '../services/textractService';

jest.mock('../utils/apiUtils.ts', () => ({
  request: jest.fn(),
}));

const API = 'https://talangindong-api.icarusphantom.dev';

describe('scanReceipt', () => {
  it('should call request with correct URL and data', async () => {
    const imageBase64 = 'some-image-base64-string';
    const requestMock = require('../utils/apiUtils.ts').request;

    await scanReceipt(imageBase64);

    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(requestMock).toHaveBeenCalledWith({
      method: 'POST',
      url: `${API}/v1/textract/scan`,
      useAuth: true,
      data: {
        bytes: imageBase64,
      },
    });
  });
});