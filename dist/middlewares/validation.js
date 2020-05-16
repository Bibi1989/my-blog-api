"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
exports.validateUsers = (body) => {
    const schema = joi_1.default.object({
        username: joi_1.default.string().trim(),
        email: joi_1.default
            .string()
            .trim()
            .email(),
        password: joi_1.default
            .string()
            .trim()
            .min(4)
            .required()
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
        stripUnknown: true
    });
    return {
        error,
        value
    };
};
exports.validateAuth = (body) => {
    const schema = joi_1.default.object({
        email: joi_1.default
            .string()
            .trim()
            .email(),
        password: joi_1.default
            .string()
            .trim()
            .min(4)
            .required()
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
        stripUnknown: true
    });
    return {
        error,
        value
    };
};
exports.validateContacts = (body) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().trim(),
        email: joi_1.default
            .string()
            .trim()
            .email(),
        phone: joi_1.default
            .string()
            .trim()
            .min(4)
            .required()
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
        stripUnknown: true
    });
    return {
        error,
        value
    };
};
//# sourceMappingURL=validation.js.map