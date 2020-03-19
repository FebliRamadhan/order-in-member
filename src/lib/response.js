exports.json = (response, statusCode = 200) => {
  return (result) => {

    if (result instanceof Array) {
      return response.status(statusCode).json({ data: result });
    }

    if (typeof result === 'string') {
      result = JSON.parse(result);
    }

    return response.status(statusCode).json(result);

  }
}