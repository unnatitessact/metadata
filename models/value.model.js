import mongoose from 'mongoose';

const ValueSchema = new mongoose.Schema({
  value: {
    type: String,
    default: '',
  },
  tabId: {
    type: mongoose.mongoose.Schema.Types.ObjectId,
    ref: 'Tab',
  },
  fieldId: {
    type: mongoose.mongoose.Schema.Types.ObjectId,
    ref: 'Field',
  },
  fileId: {
    type: String,
  },
});

const ValueModel = mongoose.model('Value', ValueSchema);
export default ValueModel;
