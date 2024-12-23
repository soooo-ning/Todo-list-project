const { authError, forbidden } = require('../utils/common');

exports.isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return authError(
      res,
      new Error('Not authenticated'),
      '인증되지 않은 접근',
      '로그인이 필요한 서비스입니다',
    );
  }
  next();
};

exports.hasPermission = (req, res, next) => {
  const resourceUserId = req.params.userId || req.body.user_id;
  if (req.session.user.id !== parseInt(resourceUserId)) {
    return forbidden(
      res,
      new Error('No permission'),
      '권한 없는 접근',
      '해당 리소스에 대한 접근 권한이 없습니다',
    );
  }
  next();
};
