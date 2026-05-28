const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
firstName: {
    type: String,
},
lastName: {
    type: String,
},
email: {
    type: String,
},
phone: {
    type: String,
    unique: true,
    sparse: true,
},
role: {
    type: String,
},
roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
},
userType: {
    type: String,
},  
externalUserId: {
    type: String,
    unique: true,
    sparse: true
},
isDeleted: {
    type: Boolean,
    default: false
},
activeStatus: {
    type: Boolean,
    default: true
},
UserAudience: {
    type: String,
},
createdAt: {
    type: Date,
    default: Date.now
},
updatedAt: {
    type: Date,
    default: Date.now
},
telegramUserId: String,
telegramSession: String,   
telegramAuthState: {
  isAuthenticated: Boolean,
  lastLoginAt: Date
}

})

module.exports = mongoose.model('users', userSchema);