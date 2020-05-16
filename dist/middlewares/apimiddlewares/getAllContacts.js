"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_connect_1 = require("../../models/pg-connect");
const validation_1 = require("../validation");
// get all contacts
exports.getAllContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield pg_connect_1.db.query(pg_connect_1.sql `SELECT * FROM contacts WHERE user_id = ${req.user.id}`);
        res.status(200).json({ data: contacts });
    }
    catch (error) {
        console.log(error.message);
        res.status(401).json({ error: error.message });
    }
});
exports.getAContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const contact = yield pg_connect_1.db.query(pg_connect_1.sql `SELECT * FROM contacts WHERE id = ${id}`);
        res.status(200).json({ data: contact });
    }
    catch (error) {
        console.log(error.message);
        res.status(404).json({ error: error.message });
    }
});
// post a contact
exports.postContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = validation_1.validateContacts(req.body);
    if (error) {
        return res.status(404).json({ error: error.details[0].message });
    }
    const { name, email, phone } = value;
    try {
        let contact = yield pg_connect_1.db.query(pg_connect_1.sql `INSERT INTO contacts(name, user_id, email, phone) VALUES (${name}, ${req.user.id}, ${email}, ${phone}) returning *`);
        res.status(200).json({ data: contact });
    }
    catch (error) {
        console.log(error.message);
        res.status(404).json({ error: error.message });
    }
});
//# sourceMappingURL=getAllContacts.js.map