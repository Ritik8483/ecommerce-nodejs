const { responseCodeMsg } = require("../constant/constant");

exports.responder = (response, status, data, total) => {
  response.status(200).json({
    code: status,
    data,
    message: responseCodeMsg[status],
    total: total || undefined,
  });
};

exports.errorResponder = (response, error) => {
  response.status(400).json(error);
  // response.status(400).json({ error: validationError.array() });
};
