import customError from "../utils/customError.js";

const errorHandler = (error, req, res, next) => {
  if (error.name === "ValidationError") {
    console.log(error);
    return res.status(400).send({
      type: "Input validation errror",
      details: error.details,
    });
  }
  if (error.name === "MongooseError") {
    return res.status(400).send({
      type: "Database connection failed",
      details: error.message,
    });
  }

  if (error instanceof customError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.log(error);
  return res.status(500).json({ message: "Internal server Error" });
};

export default errorHandler;
