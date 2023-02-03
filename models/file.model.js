import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    require: true,
  },
  fileId: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    enum: ['file', 'folder'],
  },
  tabData: [
    {
      tab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tab',
      },
      table: [
        [
          {
            field: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Field',
            },
            value: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Value',
            },
          },
        ],
      ],
      dict: [
        {
          field: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Field',
          },
          value: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Value',
          },
        },
      ],
    },
  ],
});

const FileModel = mongoose.model('File', FileSchema);

export default FileModel;
