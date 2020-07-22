const express = require('express');
const busboy = require('connect-busboy');
const path = require('path');
const fs = require('fs-extra');

const app = express();
app.use(busboy({
    highWaterMark: 2 * 1024 * 1024,
}));

const uploadPath = path.join(__dirname, 'uploads/');
fs.ensureDir(uploadPath);

app.route('/upload').post((req, res, next) => {


    req.pipe(req.busboy);

    req.busboy.on('file', (fieldname, file, filename) => {
        console.log(`Upload of '${filename}' started`);
        const fstream = fs.createWriteStream(path.join(uploadPath, filename));
        file.pipe(fstream);
    });

    req.busboy.on('finish', function() {
        console.log('finised uploading files')
        res.redirect('/upload-finished')
      });
    
});

app.get('/', (req, res) => {
    return res.sendFile(`${__dirname}/index.html`);
});

app.get('/upload-finished', (req, res) => res.sendFile(`${__dirname}/finished.html`));

console.log('upload server is running...')
app.listen(8888);