/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

// 提供错误脚本
app.get('/error.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
    console.log('Error script loaded!');
    throw new Error('Cross-origin error from error.js');
  `);
});

app.listen(port, () => {
  console.log(`packages/core/server running at http://localhost:${port}`);
});
