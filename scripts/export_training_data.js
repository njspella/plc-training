#!/usr/bin/env node
/**
 * Export TrainingData (+ slide image maps) from js/data.js to JSON for offline generators.
 * Usage: node scripts/export_training_data.js [outfile]
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const dataPath = path.join(root, 'js', 'data.js');
const kcMcPath = path.join(root, 'js', 'knowledgeCheckMc.js');
const outPath = process.argv[2] || path.join(root, 'scripts', 'training_data.json');

let code = fs.readFileSync(dataPath, 'utf8');
if (fs.existsSync(kcMcPath)) {
  code += '\n' + fs.readFileSync(kcMcPath, 'utf8');
}
const sandbox = { globalThis: {} };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(
  code +
    '\n;globalThis.__export = { TrainingData, LocalCabinetImages, LocalModule2DeviceImages, LocalSafetyControllerImages };',
  sandbox
);

const exp = sandbox.__export;
if (!exp || !exp.TrainingData) {
  console.error('Failed to export TrainingData');
  process.exit(1);
}

fs.writeFileSync(
  outPath,
  JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      source: 'js/data.js + js/knowledgeCheckMc.js',
      TrainingData: exp.TrainingData,
      LocalCabinetImages: exp.LocalCabinetImages || {},
      LocalModule2DeviceImages: exp.LocalModule2DeviceImages || {},
      LocalSafetyControllerImages: exp.LocalSafetyControllerImages || {}
    },
    null,
    2
  )
);
console.log('Wrote', outPath);
