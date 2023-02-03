import mongoose from 'mongoose';

const FieldSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  placeholder: {
    type: String,
    require: true,
  },
  options: {
    type: [String],
  },
  type: {
    type: String,
  },
  tabId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tab',
  },
  containerType: {
    type: [String],
    enum: ['file', 'folder'],
  },
  categoryType: {
    type: [String],
    enum: [
      'movies',
      'songs',
      'promos',
      'commercial',
      'series',
      'events',
      'sports',
    ],
  },
});

const FieldModel = mongoose.model('Field', FieldSchema);

export default FieldModel;
