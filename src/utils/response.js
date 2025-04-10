class ResponseHandler {
  static success(res, message, data = {}) {
    return res.status(200).json({
      success: true,
      message,
      ...data,
    });
  }

  static created(res, message, data = {}) {
    return res.status(201).json({
      success: true,
      message,
      ...data,
    });
  }

  static badRequest(res, message) {
    return res.status(400).json({
      success: false,
      message,
    });
  }

  static unauthorized(res, message) {
    return res.status(401).json({
      success: false,
      message,
    });
  }

  static forbidden(res, message) {
    return res.status(403).json({
      success: false,
      message,
    });
  }

  static notFound(res, message) {
    return res.status(404).json({
      success: false,
      message,
    });
  }

  static internalError(res, message = 'Internal Server Error') {
    return res.status(500).json({
      success: false,
      message,
    });
  }
}

export default ResponseHandler;