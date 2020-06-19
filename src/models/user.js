import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    login: {
        type: String,
        unique: true
    },
    password: String,
    additionalAddress: String
}, {
    timestamps: true,
});

UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);

            this.password = hash;
            next();
        });
    });

});

export default mongoose.model('User', UserSchema);