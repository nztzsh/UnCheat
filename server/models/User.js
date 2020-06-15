const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    googleId: {type: String, required: true, unique: true},
    displayName: {type: String},
    email: {type: String},
    thumbnail: {type: String}
});

module.exports = mongoose.models['User'] || mongoose.model('User', UserSchema);