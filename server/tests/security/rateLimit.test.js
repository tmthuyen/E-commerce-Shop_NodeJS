jest.mock('express-rate-limit', () => jest.fn((options) => options));

const rateLimit = require('express-rate-limit');
const { globalLimiter, authLimiter } = require('../../src/security/rateLimit');

describe('security/rateLimit', () => {
  test('configures the global limiter with the expected defaults', () => {
    expect(rateLimit).toHaveBeenCalledTimes(2);
    expect(globalLimiter).toMatchObject({
      windowMs: 15 * 60 * 1000,
      max: 1000,
      standardHeaders: true,
      legacyHeaders: false,
    });
  });

  test('configures the auth limiter with the brute-force protection settings', () => {
    expect(authLimiter).toMatchObject({
      windowMs: 10 * 60 * 1000,
      max: 50,
      message: { error: 'Quá nhiều thử đăng nhập, vui lòng thử lại sau.' },
    });
  });
});