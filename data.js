import fs from 'fs';

function parseString(str) {
  const [titleAndTypeAndOptions, type, categories] = str.split('---');
  console.log({ titleAndTypeAndOptions });
  const typeRegex = /\(([^)]+)\)/;
  const fieldType = typeRegex.exec(titleAndTypeAndOptions)[1];
  const fieldName = titleAndTypeAndOptions.split('(')[0].trim();
  const optionsRegex = /\[([^)]+)\]/;
  const options = optionsRegex.exec(titleAndTypeAndOptions);

  return {
    name: fieldName.trim(),
    fieldType: fieldType.trim().toLowerCase(),
    type: type
      .trim()
      .split(',')
      .map((item) => (item.trim() === 'fi' ? 'file' : 'folder')),
    categories: categories
      .trim()
      .split(',')
      .map((c) => c.trim().toLowerCase()),
    options: options ? options[1].split(',').map((o) => o.trim()) : [],
  };
}

fs.readFile('item.txt', 'utf8', (err, data) => {
  if (err) throw err;

  let arr = [];
  let lines = data.split('\n');

  let formattedLines = [];

  lines.map((line) => formattedLines.push(line.slice(0, -1)));

  formattedLines.map((line) => arr.push(parseString(line)));

  // fs.writeFile('castandcredits.js', JSON.stringify(arr), (err) => {
  //   if (err) throw err;
  //   console.log('The file has been saved!');
  // });

  console.log({ lines });
});
