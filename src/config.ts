const fs = require('fs');
import path from 'path';
console.log(__dirname)
export const config = JSON.parse(fs.readFileSync(
    path.join(__dirname, 'config.json'),
));