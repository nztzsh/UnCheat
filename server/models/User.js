const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new Schema({
    googleId: {type: String, required: true, unique: true},
    displayName: {type: String},
    email: {type: String},
    thumbnail: {type: String},
    examsCreated: {type: ObjectId},
    examsAttended: {type: ObjectId}
});

module.exports = mongoose.models['User'] || mongoose.model('User', UserSchema);