import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { promises as fs } from 'fs';
import cors from 'cors';

import { parseSDF } from './src/sdfProccess.js';

export const app = express();
const port = 3001;

// Get absolute path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Authorize CORS
app.use(cors());
app.use(express.json());

// Configure multer for handling SDF file upload
// Store file in memory, not on disk
const storage = multer.memoryStorage(); 

// Filter to verify file type
const fileFilter = (req, file, cb) => {
    const fileExtension = extname(file.originalname).toLowerCase();
    if (fileExtension === '.sdf') {
        cb(null, true);
    } else {
        req.fileValidationError = 'Invalid file type, only SDF files are allowed!';
        cb(null, false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Endpoint for uploading and parsing SDF file
app.post('/upload-sdf', (req, res) => {
    upload.single('sdfFile')(req, res, async (err) => {
        if (req.fileValidationError) {
            return res.status(400).send(req.fileValidationError);
        }
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        
        // Path to save the JSON file
        const jsonFilePath = join(__dirname, 'sdf_files', `${req.file.originalname}.json`);

        try {
            //check if file already exists
            await fs.access(jsonFilePath);
            return res.status(400).send('File already exists.');

        } catch (error) {
            try {
                // Parse the SDF file content
                const sdfContent = req.file.buffer.toString('utf-8');
                const sdfData = parseSDF(sdfContent);
        
                // Save the parsed data as JSON
                await fs.writeFile(jsonFilePath, JSON.stringify(sdfData, null, 2));
        
                res.send('File parsed and JSON saved successfully.');
            } catch (error) {
                res.status(500).send('Error parsing SDF file.');
            }
        }
    });
});
  
// Endpoint API for sending parsed SDF file
app.get('/map/:filename', async (req, res) => {
    try {
        const jsonFilePath = join(__dirname, 'sdf_files', `${req.params.filename}.json`);
        const jsonData = await fs.readFile(jsonFilePath, 'utf-8');
        res.json(JSON.parse(jsonData));
    } catch (error) {
        res.status(500).send('Error reading parsed SDF JSON file. File may not exist.');
    }
});

// Endpoint to delete a parsed JSON file
app.delete('/delete-sdf-json/:filename', async (req, res) => {
    try {
        const jsonFilePath = join(__dirname, 'sdf_files', `${req.params.filename}.json`);
        await fs.unlink(jsonFilePath);
        res.send('JSON file deleted successfully.');
    } catch (error) {
        res.status(500).send('Error deleting JSON file.');
    }
});

// Endpoint to list all SDF files
app.get('/list-sdf', async (req, res) => {
    try {
        const files = await fs.readdir(join(__dirname, 'sdf_files'));
        res.json(files && files.map((file) => file.replace('.json', '')));
    } catch (error) {
        res.status(500).send('Error listing SDF JSON files.');
    }
});

export const server = app.listen(port, () => {
    console.log(`Backend launched on http://localhost:${port}`);
});
