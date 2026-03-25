import userService from '../services/user.service.js';

export default {
  register: async (req, res, next) => {
    try {
      // req.body chứa dữ liệu từ Thunder Client gửi lên
      const newUser = await userService.register(req.body);
      res.created(newUser); 
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      res.ok(result);
    } catch (error) {
      next(error);
    }
  }
};