/**
 * API 성공 응답을 보내는 함수
 * @param {Response} res Express Response 객체
 * @param {Object|Array} data 응답 데이터
 * @param {string} message 성공 메시지
 * @param {number} statusCode HTTP 상태 코드
 */

// 성공
exports.success = (res, data = null, message = 'Success', statusCode = 200) => {
  console.log(message, data);
  const response = {
    status: 'success',
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

/**
 * 서버 에러가 났을 때 실행될 코드 모음
 * @param {Response} res Express Response 객체
 * @param {Error} err 에러 객체
 * @param {string} errMsgInServer 서버 콘솔에 띄워줄 메시지
 * @param {string} errMsgInClient 클라이언트에게 보내줄 메시지
 */

// 서버 에러
exports.serverError = (
  res,
  err,
  errMsgInServer = 'ERROR!',
  errMsgInClient = '에러낫슈',
) => {
  console.error(errMsgInServer, err);
  res.status(500).json({
    status: 'fail',
    message: errMsgInClient,
    error_code: err.code || 'UNKNOWN_ERROR',
  });
};

// 유효성 검사 실패
exports.validationError = (
  res,
  err,
  errMsgInServer = 'Validation Error',
  errMsgInClient = '입력값이 올바르지 않습니다',
) => {
  console.error(errMsgInServer, err);
  res.status(400).json({
    status: 'fail',
    message: errMsgInClient,
    error_code: 'VALIDATION_ERROR',
  });
};

// 인증 실패
exports.authError = (
  res,
  err,
  errMsgInServer = 'Auth Error',
  errMsgInClient = '로그인이 필요합니다',
) => {
  console.error(errMsgInServer, err);
  res.status(401).json({
    status: 'fail',
    message: errMsgInClient,
    error_code: 'AUTH_ERROR',
  });
};

// 권한 없음
exports.forbidden = (
  res,
  err,
  errMsgInServer = 'Forbidden Error',
  errMsgInClient = '접근 권한이 없습니다',
) => {
  console.error(errMsgInServer, err);
  res.status(403).json({
    status: 'fail',
    message: errMsgInClient,
    error_code: 'FORBIDDEN',
  });
};

// 리소스를 찾을 수 없음
exports.notFound = (
  res,
  err,
  errMsgInServer = 'Not Found Error',
  errMsgInClient = '요청하신 리소스를 찾을 수 없습니다',
) => {
  console.error(errMsgInServer, err);
  res.status(404).json({
    status: 'fail',
    message: errMsgInClient,
    error_code: 'NOT_FOUND',
  });
};

// 중복 데이터 충돌
exports.conflict = (
  res,
  err,
  errMsgInServer = 'Conflict Error',
  errMsgInClient = '이미 존재하는 데이터입니다',
) => {
  console.error(errMsgInServer, err);
  res.status(409).json({
    status: 'fail',
    message: errMsgInClient,
    error_code: 'CONFLICT',
  });
};
