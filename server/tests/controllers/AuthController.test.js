jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock-token'),
}));

jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: jest.fn(),
  })),
}));

jest.mock('node-fetch', () => jest.fn());

jest.mock('../../src/utils/emailUtil', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue({ success: true }),
  sendPasswordResetEmail: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('../../src/app/models/UserModel', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

const AuthController = require('../../src/app/controllers/AuthController');
const User = require('../../src/app/models/UserModel');

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('login returns a token and user data when credentials are valid', async () => {
    const user = {
      _id: 1,
      email: 'customer@example.com',
      role: 'customer',
      password: 'hashed-password',
      comparePassword: jest.fn().mockResolvedValue(true),
      toObject: jest.fn().mockReturnValue({
        _id: 1,
        email: 'customer@example.com',
        role: 'customer',
        password: 'hashed-password',
      }),
    };

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(user),
    });

    const req = {
      body: {
        email: 'customer@example.com',
        password: 'secret-password',
      },
    };
    const res = createRes();

    await AuthController.login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'customer@example.com' });
    expect(user.comparePassword).toHaveBeenCalledWith('secret-password');
    expect(res.json).toHaveBeenCalledWith({
      user: {
        _id: 1,
        email: 'customer@example.com',
        role: 'customer',
      },
      token: 'mock-token',
    });
  });

  test('login returns 401 when the user does not exist', async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const req = {
      body: {
        email: 'missing@example.com',
        password: 'secret-password',
      },
    };
    const res = createRes();

    await AuthController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid credentials',
    });
  });

  test('register validates required fields before touching the database', async () => {
    const req = {
      body: {
        email: 'new@example.com',
        full_name: 'New Customer',
      },
    };
    const res = createRes();

    await AuthController.register(req, res);

    expect(User.findOne).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Vui lòng điền đầy đủ thông tin đăng ký',
    });
  });
});