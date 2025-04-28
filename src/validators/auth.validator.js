import Joi from "joi";
const validator = (schema, payload, res) => {
  const { error, value } = schema.validate(payload);
  if (error) throw error;
};

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  fullName: Joi.string().required(),
  kidsName: Joi.string().required(),
  password: Joi.string().min(6),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const passwordResetRequestSchema = Joi.object({
  email: Joi.string().email(),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(6).required(),
  otp: Joi.string().length(6),
});

export const validateSignup = (payload, res) =>
  validator(signupSchema, payload, res);
export const validateLogin = (payload, res) =>
  validator(loginSchema, payload, res);
export const validatePasswordResetRequest = (payload, res) =>
  validator(passwordResetRequestSchema, payload, res);
export const validateResetPassword = (payload, res) =>
  validator(resetPasswordSchema, payload, res);
