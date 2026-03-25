import * as authService from '../services/auth-s.js';

export async function signup(req, res) {
  try {
    const result = await authService.signup(req.body);
    return res.created({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: {
        accessToken: result.accessTokenExpiresIn,
        refreshToken: result.refreshTokenExpiresIn,
      }
    });
  } catch (error) {
    return res.error(error);
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return res.ok({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: {
        accessToken: result.accessTokenExpiresIn,
        refreshToken: result.refreshTokenExpiresIn,
      }
    });
  } catch (error) {
    return res.error(error);
  }
}

export async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshTokens(refreshToken);
    return res.ok({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: {
        accessToken: result.accessTokenExpiresIn,
        refreshToken: result.refreshTokenExpiresIn,
      }
    });
  } catch (error) {
    return res.error(error);
  }
}

export async function logout(req, res) {
  try {
    const { refreshToken } = req.body;
    const result = await authService.logout(refreshToken);
    return res.ok(result);
  } catch (error) {
    return res.error(error);
  }
}

export async function logoutAll(req, res) {
  try {
    const userId = req.user.id; // Lấy từ middleware protect lát nữa viết
    const result = await authService.logoutAll(userId);
    return res.ok(result);
  } catch (error) {
    return res.error(error);
  }
}

export async function me(req, res) {
  try {
    const user = { ...req.user };
    delete user.password;
    return res.ok({ user });
  } catch (error) {
    return res.error(error);
  }
}