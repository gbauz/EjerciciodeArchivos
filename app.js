// app.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/nombre_de_tu_base_de_datos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



const upload = multer({ dest: 'uploads/' });

// Define el modelo de datos para los archivos PDF
const File = mongoose.model('File', {
  name: String,
  path: String,
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/', async (req, res) => {
    try {
      const files = await File.find().exec();
      res.render('index', { files });
    } catch (err) {
      console.error(err);
    }
  });
  
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  app.post('/upload', upload.single('pdf'), async (req, res) => {
    const file = new File({
      name: req.file.originalname,
      path: req.file.path,
    });
  
    try {
      await file.save();
      res.redirect('/');
    } catch (err) {
      console.error(err);
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
