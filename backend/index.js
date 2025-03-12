import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { promises as fs } from 'fs';
import cors from 'cors';

import { parseSDF } from './src/sdfProccess.js';
import { parseVerilog } from './src/vProccess.js';

const app = express();
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
const createFileFilter = (allowedExtensions) => {
    return (req, file, cb) => {
        const fileExtension = extname(file.originalname).toLowerCase();
        if (fileExtension === allowedExtensions) {
            cb(null, true);
        } else {
            req.fileValidationError = `Invalid file type, only ${allowedExtensions} files are allowed!`;
            cb(null, false);
        }
    };
};

const sdfFileFilter = createFileFilter('.sdf');
const verilogFileFilter = createFileFilter('.v');

const uploadSdf = multer({ storage: storage, fileFilter: sdfFileFilter });
const uploadVerilog = multer({ storage: storage, fileFilter: verilogFileFilter });

//////////////////////////
//Endpoint for SDF files//
//////////////////////////

// Endpoint for uploading and parsing SDF file
app.post('/api/sdf/upload', (req, res) => {
    uploadSdf.single('sdfFile')(req, res, async (err) => {
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

                // Check if the file is empty
                if (!sdfContent) {
                    return res.status(400).send('Uploaded file is empty.');
                }

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
app.get('/api/sdf/map/:filename', async (req, res) => {
    try {
        const jsonFilePath = join(__dirname, 'sdf_files', `${req.params.filename}.json`);
        const jsonData = await fs.readFile(jsonFilePath, 'utf-8');
        res.json(JSON.parse(jsonData));
    } catch (error) {
        res.status(500).send('Error reading parsed SDF JSON file. File may not exist.');
    }
});

// Endpoint to delete a parsed SDF JSON file
app.delete('/api/sdf/delete-json/:filename', async (req, res) => {
    try {
        const jsonFilePath = join(__dirname, 'sdf_files', `${req.params.filename}.json`);
        await fs.unlink(jsonFilePath);
        res.send('SDF JSON file deleted successfully.');
    } catch (error) {
        res.status(500).send('Error deleting SDF JSON file, the file may not exists.');
    }
});

// Endpoint to list all SDF files
app.get('/api/sdf/list', async (req, res) => {
    try {
        const files = await fs.readdir(join(__dirname, 'sdf_files'));
        res.json(files && files.map((file) => file.replace('.json', '')));
    } catch (error) {
        res.status(500).send('Error listing SDF JSON files.');
    }
});

//////////////////////////////
//Endpoint for Verilog files//
//////////////////////////////

// Endpoint for uploading and parsing Verilog file
app.post('/api/verilog/upload', (req, res) => {
    uploadVerilog.single('verilogFile')(req, res, async (err) => {
        if (req.fileValidationError) {
            return res.status(400).send(req.fileValidationError);
        }
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        
        // Path to save the JSON file
        const jsonFilePath = join(__dirname, 'v_files', `${req.file.originalname}.json`);

        try {
            //check if file already exists
            await fs.access(jsonFilePath);
            return res.status(400).send('File already exists.');

        } catch (error) {
            try {
                // Parse the SDF file content
                const verilogContent = req.file.buffer.toString('utf-8');

                // Check if the file is empty
                if (!verilogContent) {
                    return res.status(400).send('Uploaded file is empty.');
                }

                const verilogData = parseVerilog(verilogContent);
        
                // Save the parsed data as JSON
                await fs.writeFile(jsonFilePath, JSON.stringify(verilogData, null, 2));
        
                res.send('File parsed and Verilog JSON saved successfully.');
            } catch (error) {
                res.status(500).send('Error parsing Verilog file.');
            }
        }
    });
});

// Endpoint API for sending parsed Verilog file
app.get('/api/verilog/map/:filename', async (req, res) => {
    try {
        const jsonFilePath = join(__dirname, 'v_files', `${req.params.filename}.json`);
        const jsonData = await fs.readFile(jsonFilePath, 'utf-8');
        res.json(JSON.parse(jsonData));
    } catch (error) {
        res.status(500).send('Error reading parsed Verilog JSON file. File may not exist.');
    }
});

// Endpoint to delete a parsed Verilog JSON file
app.delete('/api/verilog/delete-json/:filename', async (req, res) => {
    try {
        const jsonFilePath = join(__dirname, 'v_files', `${req.params.filename}.json`);
        await fs.unlink(jsonFilePath);
        res.send('Verilog JSON file deleted successfully.');
    } catch (error) {
        res.status(500).send('Error deleting Verilog JSON file, the file may not exists.');
    }
});

// Endpoint to list all SDF files
app.get('/api/verilog/list', async (req, res) => {
    try {
        const files = await fs.readdir(join(__dirname, 'v_files'));
        res.json(files && files.map((file) => file.replace('.json', '')));
    } catch (error) {
        res.status(500).send('Error listing Verilog JSON files.');
    }
});


app.listen(port, () => {
    console.log(`Backend launched on http://localhost:${port}`);
});