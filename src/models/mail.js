import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const MailSchema = new Schema({
    from: String,
    to: String,
    subject: String,
    text: String,
    html: String,
}, {
    timestamps: true,
});

export default mongoose.model('Mail', MailSchema);