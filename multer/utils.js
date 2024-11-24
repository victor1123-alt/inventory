const multer = require('multer');
const path = require('path');

// Set the maximum file size for uploads (e.g., 10 MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Define storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'statics/img/category/');  // The directory to store images
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // Get the file extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique name
    const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`; // New file name
    cb(null, fileName);  // Set the file name
  }
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // Accept the file
  } else {
    cb(new Error('Only .jpeg, .png, .gif files are allowed'), false);  // Reject the file
  }
};

// Initialize multer with size limit and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },  // Set file size limit
});

module.exports = upload;
