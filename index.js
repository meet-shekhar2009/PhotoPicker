const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Set the views directory and the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse request bodies as JSON
app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Define the route for the home page
app.get('/', (req, res) => {
  // Get the list of image files from the "public/images" folder
  const imageFolder = path.join(__dirname, 'public/images');
  fs.readdir(imageFolder, (err, files) => {
    if (err) {
      console.error('Error reading image folder:', err);
      res.sendStatus(500);
      return;
    }

    // Render the home page with the image file list
    res.render('index', { files });
  });
});

// Define the route for saving selected images
app.post('/save', (req, res) => {
  // Get the list of selected image filenames from the request body
  const selectedImages = req.body.images;

  // Create the "public/selected-images" folder if it doesn't exist
  const selectedImagesFolder = path.join(__dirname, 'public/selected-images');
  if (!fs.existsSync(selectedImagesFolder)) {
    fs.mkdirSync(selectedImagesFolder);
  }

  // Move selected images from "public/images" to "public/selected-images"
  selectedImages.forEach((image) => {
    const sourcePath = path.join(__dirname, 'public/images', image);
    const destinationPath = path.join(selectedImagesFolder, image);

    fs.rename(sourcePath, destinationPath, (err) => {
      if (err) {
        console.error('Error moving image:', err);
      }
    });
  });

  res.sendStatus(200);
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
