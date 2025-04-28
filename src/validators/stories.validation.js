import Joi from "joi";

const validator = (schema, payload) => {
  const { error, value } = schema.validate(payload);
  if (error) throw error;
};

const uploadStorySchema = Joi.object({
  title: Joi.string().min(4).max(15).required(),
  category: Joi.string(),
  text: Joi.string().min(10).max(300),
});

export const validateUploadStory = (payload) => {
  validator(uploadStorySchema, payload);
};
