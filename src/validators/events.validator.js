import Joi from "joi";

const validator = (schema, payload, res) => {
  const { error, value } = schema.validate(payload);
  if (error) throw error;
};

const createEventSchema = Joi.object({
  title: Joi.string().min(4).max(15).required(),
  description: Joi.string().min(20).required(),
  attendanceCapacity: Joi.number().greater(0).required(),
  dueDate: Joi.date().greater(Date.now()).required(),
  location: Joi.string(),
});

export const validateCreateEvent = (payload, res) => {
  return validator(createEventSchema, payload, res);
};
