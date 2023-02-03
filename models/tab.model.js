import mongoose from 'mongoose';

const TabSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  altName: {
    type: String,
    require: true,
  },
  isTable: {
    type: Boolean,
  },
  metadataCateogry: {
    type: String,
  },
});

const TabModel = mongoose.model('Tab', TabSchema);

export default TabModel;
