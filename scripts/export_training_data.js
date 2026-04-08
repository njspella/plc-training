#!/usr/bin/env node
/**
 * Export TrainingData (+ WikimediaModule2Images) from js/data.js to JSON for offline generators.
 * Usage: node scripts/export_training_data.js [outfile]
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const dataPath = path.join(root, 'js', 'data.js');
const outPath = process.argv[2] || path.join(root, 'scripts', 'training_data.json');

const code = fs.readFileSync(dataPath, 'utf8');
const sandbox = { globalThis: {} };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(
  code + '\n;globalThis.__export = { TrainingData, WikimediaModule2Images };',
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
      source: 'js/data.js',
      TrainingData: exp.TrainingData,
      WikimediaModule2Images: exp.WikimediaModule2Images || {}
    },
    null,
    2
  )
);
console.log('Wrote', outPath);
