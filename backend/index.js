import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { promises as fs } from 'fs';
import cors from 'cors';

import { parseSDF } from './src/sdfProccess.js';
import { parseVerilog } from './src/vProccess.js';
import { mergeJsonForD3 } from './src/mergeVerilogSDF.js';

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
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Définition des extensions autorisées PAR CHAMP
        const fieldExtensionMap = {
            sdfFile: ['.sdf'],
            verilogFile: ['.v']
        };

        const fileExtension = extname(file.originalname).toLowerCase();
        const allowedExtensions = fieldExtensionMap[file.fieldname];

        // Vérifier si l'extension correspond au bon champ
        if (allowedExtensions && allowedExtensions.includes(fileExtension)) {
            cb(null, true);
        } else {
            req.fileValidationError = `Invalid file type for ${file.fieldname}, only ${allowedExtensions?.join(', ')} files are allowed!`;
            cb(null, false);
        }
    },
});


// Endpoint for uploading and parsing SDF & Verilog file
app.post('/api/upload', upload.fields([{ name: 'sdfFile' }, { name: 'verilogFile' }]), async (req, res) => {
    try {
        // Vérification des erreurs de validation de fichier
        if (req.fileValidationError) {
            return res.status(400).send(req.fileValidationError);
        }   

        const sdfFile = req.files?.['sdfFile']?.[0];
        const verilogFile = req.files?.['verilogFile']?.[0];

        // Check if files are uploaded
        if (!sdfFile || !verilogFile) {
            return res.status(400).send('Both SDF and Verilog files must be uploaded.');
        }

        const sdfContent = sdfFile.buffer.toString('utf-8').trim();
        const verilogContent = verilogFile.buffer.toString('utf-8').trim();

        if (!sdfContent || !verilogContent) {
            return res.status(400).send('One or both uploaded files are empty.');
        }

        // Parse SDF and Verilog files
        let sdfData, verilogData, commonInstances;
        try {
            sdfData = parseSDF(sdfContent);
        } catch (error) {
            return res.status(500).send('Error parsing SDF file.');
        }

        try {
            verilogData = parseVerilog(verilogContent);
        } catch (error) {
            return res.status(500).send('Error parsing Verilog file.');
        }
        
        try {
            commonInstances = mergeJsonForD3(verilogData, sdfData);
        } catch (error) {
            console.log('Error merging files:', error);
            
            return res.status(500).send('Error merging files.');
        }

        // Save parsed SDF and Verilog files
        try {
            const projectName = req.body.projectName;
            if (!projectName) {
                return res.status(400).send('Project name is required.');
            }

            const projectDir = join(__dirname, 'parsed_files', projectName);

            //check if project already exists
            const exists = await fs.access(projectDir).then(() => true).catch(() => false);
            if (exists) {
                return res.status(404).send('The project already exists');
            }

            await fs.mkdir(projectDir, { recursive: true });
            const sdfJsonPath = join(projectDir, `${sdfFile.originalname}.json`);
            const verilogJsonPath = join(projectDir, `${verilogFile.originalname}.json`);

            //check if files exists
            try {
                // Vérifier si l'un des fichiers existe déjà
                const sdfExists = await fs.access(sdfJsonPath).then(() => true).catch(() => false);
                const verilogExists = await fs.access(verilogJsonPath).then(() => true).catch(() => false);
            
                if (sdfExists) {
                    return res.status(400).send('SDF file already exists.');
                }
                if (verilogExists) {
                    return res.status(400).send('Verilog file already exists.');
                }
            
                // Écriture des fichiers JSON
                await fs.writeFile(sdfJsonPath, JSON.stringify(sdfData, null, 2));
                await fs.writeFile(verilogJsonPath, JSON.stringify(verilogData, null, 2));
                await fs.writeFile(join(projectDir, `${projectName}.json`), JSON.stringify(commonInstances, null, 2));
            
                res.send('SDF and Verilog files successfully parsed and merged.');
            
            } catch (error) {
                res.status(500).send('Error processing files.');
            }

        } catch (error) {
            console.log('Error saving parsed JSON files:', error);
            
            res.status(500).send('Error saving parsed JSON files.');
        }

    } catch (error) {
        res.status(500).send('Unexpected server error.');
    }
});

  
// Endpoint API for sending parsed SDF file
app.get('/api/map/:filename', async (req, res) => {
    try {
        const projectName = req.body.projectName;
        if (!projectName) {
            return res.status(400).send('Project name is required.');
        }

        const jsonFilePath = join(__dirname, 'parsed_files', `${projectName}`);
        const jsonData = await fs.readdir(jsonFilePath, 'utf-8');
        res.json(JSON.parse(jsonData));

    } catch (error) {
        res.status(500).send('Error reading parsed SDF JSON file. File may not exist.');
    }
});

// Endpoint to delete a parsed SDF JSON file
app.delete('/api/delete-project/:projectName', async (req, res) => {
    try {
        const projectName = req.params.projectName;
        const directoryPath = join(__dirname, 'parsed_files', projectName);

        const exists = await fs.access(directoryPath).then(() => true).catch(() => false);
        if (!exists) {
            return res.status(404).send('Directory does not exist.');
        }

        await fs.rm(directoryPath, { recursive: true, force: true });
        res.send('Directory deleted successfully.');
    } catch (error) {
        return res.status(500).send('Error deleting directory, it may not exist.');
    }
});

// Endpoint to list all SDF files
app.get('/api/list', async (req, res) => {
    try {
        const directoryPath = join(__dirname, 'parsed_files');
        const entries = await fs.readdir(directoryPath, { withFileTypes: true });

        // Show only directories
        const directories = entries
            .filter(entry => entry.isDirectory())
            .map(entry => entry.name);

        res.json(directories);
    } catch (error) {
        console.error('Error listing directories:', error);
        res.status(500).send('Error listing directories.');
    }
});

app.listen(port, () => {
    console.log(`Backend launched on http://localhost:${port}`);
});