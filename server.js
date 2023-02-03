import express from 'express';
import dotenv from 'dotenv';

// importing models
import FileModel from './models/file.model.js';
import TabModel from './models/tab.model.js';
import ValueModel from './models/value.model.js';
import FieldModel from './models/field.model.js';

// metadata fields
import { title } from './metadata-fields/title.js';
import { general } from './metadata-fields/general.js';
import { synopsis } from './metadata-fields/synopsis.js';
import { end } from './metadata-fields/end.js';
import { subtitle } from './metadata-fields/subtitle.js';
import { audio } from './metadata-fields/audio.js';
import { technical } from './metadata-fields/technical.js';
import { castandcredits } from './metadata-fields/castandcredits.js';

// mongodb connector function
import connectDB from './connectDb.js';

dotenv.config({ path: './.env' });

const app = express();
app.use(express.json());

connectDB();

const tabs = [
  {
    name: 'Title',
    altName: 'title',
    isTable: false,
  },
  {
    name: 'General',
    altName: 'general',
    isTable: false,
  },
  {
    name: 'Synopsis',
    altName: 'synopsis',
    isTable: false,
  },
  {
    name: 'Cast and Credits',
    altName: 'case and credits',
    isTable: true,
  },
  {
    name: 'Technical Metadata',
    altName: 'technical metadata',
    isTable: false,
  },
  {
    name: 'Audio',
    altName: 'audio',
    isTable: false,
  },
  {
    name: 'Subtitles/CC',
    altName: 'subtitle/cc',
    isTable: false,
  },
  {
    name: 'End Credits',
    altName: 'end credits',
    isTable: false,
  },
];

// METHOD: POST
// Desc: create tabs
app.post('/tabs', async (req, res) => {
  try {
    const tabsData = await TabModel.create(tabs);

    res.status(200).json({ tabsData });
  } catch (error) {
    console.log({ error });
  }
});

// METHOD: POST
// Desc: create fields
app.post('/fields', async (req, res) => {
  try {
    const arr = castandcredits.map((item) => ({
      name: item?.name,
      placeholder: '',
      options: item?.options,
      type: item?.fieldType,
      // tabId: '63dbb9ec32608d6098187f55',
      containerType: item?.type,
      categoryType: item?.categories,
    }));

    const titleFields = await FieldModel.create(arr);

    res.status(200).json({ msg: 'titleFields' });
  } catch (error) {
    console.log('error');
    res.status(500).json({ error });
  }
});

const createValueDocs = async (fieldId, fileId, tabId) => {
  const value = await new ValueModel({
    tabId: tabId,
    fieldId: fieldId,
    fileId: fileId,
  }).save();

  return value.id;
};

// METHOD: POST
// Desc: Create a file document
app.post('/file', async (req, res) => {
  const { fileName, fileId, containerType, categoryType } = req.body;
  try {
    const fields = await FieldModel.find({
      containerType: containerType,
      categoryType: categoryType,
    }).populate('tabId', 'name isTable');

    const tabs = fields.map((field) => ({
      name: field.tabId.name,
      id: field.tabId.id,
      isTable: field.tabId.isTable,
    }));

    const uniqueTabs = tabs.reduce((unique, tab) => {
      if (!unique[tab.id]) {
        unique[tab.id] = tab;
        return unique;
      }
      return unique;
    }, {});

    const result = Object.values(uniqueTabs);

    let tabData = [];

    for (let i = 0; i < result.length; i++) {
      const fieldsForTab = fields.filter(
        (field) => field.tabId.id === result[i].id
      );

      const dict = [];
      const table = [];

      if (result[i].isTable) {
        let fieldPair = [];

        for (const field of fieldsForTab) {
          const valueId = await createValueDocs(field.id, fileId, result[i].id);
          fieldPair.push({
            field: field.id,
            value: valueId,
          });
        }

        table.push(fieldPair);
      } else {
        for (const field of fieldsForTab) {
          const valueId = await createValueDocs(field.id, fileId, result[i].id);
          dict.push({
            field: field.id,
            value: valueId,
          });
        }
      }

      tabData.push({
        tab: result[i].id,
        dict: dict,
        table: table,
      });
    }

    const file = await FileModel.create({
      fileName,
      fileId,
      type: containerType,
      tabData,
    });

    await file.save();

    res.status(200).json({ file });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// METHOD: GET
// Desc: Get a single file

app.get('/:fileId', async (req, res) => {
  try {
    const file = await FileModel.findOne({
      fileId: req.params.fileId,
    }).populate(
      'tabData.tab tabData.dict.field tabData.dict.value',
      'isTable name placeholder type options value'
    );

    res.status(200).json({ file });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// METHOD: PUT
// Desc: Edit a single value

app.put('/value/:valueId', async (req, res) => {
  try {
    const updatedValue = req.body.value;
    const id = req.params.valueId;

    const valueField = await ValueModel.findByIdAndUpdate(
      id,
      { value: updatedValue },
      {
        new: true,
      }
    );

    res.status(200).json({ valueField });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(5000);
