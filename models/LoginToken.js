const mongoose = require('mongoose');

const loginTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1h' } // Expira en 1 hora
});

const LoginToken = mongoose.model('LoginToken', loginTokenSchema);
module.exports = LoginToken;
