export const tryCatch = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
