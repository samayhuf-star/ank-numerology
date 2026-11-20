// Run once for a NEW deployment only. Existing files are never replaced.
const fs = require('fs');
const path = require('path');
const target = process.env.REPORT_LEDGER_PATH;
if (!target || !path.isAbsolute(target)) throw new Error('Set REPORT_LEDGER_PATH to a persistent absolute path first.');
fs.mkdirSync(path.dirname(target), { recursive: true, mode: 0o700 });
const file = fs.openSync(target, 'wx', 0o600);
try { fs.writeFileSync(file, JSON.stringify({ tx: {} })); fs.fsyncSync(file); } finally { fs.closeSync(file); }
console.log('Created a new empty ledger. Keep this file on durable storage and back it up.');
