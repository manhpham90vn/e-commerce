import { StatusCodes } from "http-status-codes";

const successResponse = (res, data = null, message = null) => {
  const json = {
    status: StatusCodes.OK,
    data,
    message,
  };
  return res.status(StatusCodes.OK).json({ ...json });
};

export default successResponse;
