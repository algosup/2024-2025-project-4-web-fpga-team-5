import request from 'supertest';
import { expect, it, jest } from '@jest/globals';
import { app, server } from '../index.js';

// Mock fs.promises methods directly
jest.mock('fs', () => ({
    promises: {
        access: jest.fn(),
        writeFile: jest.fn(),
        readFile: jest.fn(),
        readdir: jest.fn(),
        unlink: jest.fn(),
    },
}));

describe('API Endpoints Tests', () => {
    afterAll((done) => {
        server.close(done);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    // ! ||--------------------------------------------------------------------------------||
    // ! ||                            In POST /api/upload/ test:                           ||
    // ! ||--------------------------------------------------------------------------------||

    // Normal Conditions Test
    it('successfully uploads and parses an SDF file with a right project name', async () => {
        const response = await request(app)
        .post('/api/upload')
        .field('projectName', 'testProject')
        .attach('sdfFile', Buffer.from('test'), './testFiles/exampleSDF.sdf')
        .attach('verilogFile', Buffer.from('test2'), './testFiles/exampleVerilog.v');

        expect(response.status).toBe(200);
        expect(response.text).toBe('Files uploaded successfully.');
    });

    // No files uploaded Test
    it('fail to uploads an SDF and a Verilog file (no files uploaded)', async () => {
        const response = await request(app)
        .post('/api/upload')
        .field('projectName', 'testProjectFailing');

        expect(response.status).toBe(400);
        expect(response.text).toBe('Both SDF and Verilog files must be uploaded.');
    });

    // No SDF file uploaded Test
    it('fail to uploads only an SDF file (no SDF file uploaded)', async () => {
        const response = await request(app)
        .post('/api/upload')
        .field('projectName', 'testProjectFailing')
        .attach('verilogFile', Buffer.from('test2'), './testFiles/exampleVerilog.v');

        expect(response.status).toBe(400);
        expect(response.text).toBe('Both SDF and Verilog files must be uploaded.');
    });

    // No Verilog file uploaded Test
    it('fail to uploads only a Verilog file (no Verilog file uploaded)', async () => {
        const response = await request(app)
        .post('/api/upload')
        .field('projectName', 'testProjectFailing')
        .attach('sdfFile', Buffer.from('test'), './testFiles/exampleSDF.sdf');

        expect(response.status).toBe(400);
        expect(response.text).toBe('Both SDF and Verilog files must be uploaded.');
    });

    // Empty SDF and empty verilog file uploaded Test
    it('fail to uploads an empty SDF and an empty Verilog file (no file with content uploaded)', async () => {
        const response = await request(app)
        .post('/api/upload')
        .field('projectName', 'testProjectFailing')
        .attach('sdfFile', Buffer.from('test'), './testFiles/emptySDF.sdf')
        .attach('verilogFile', Buffer.from('test2'), './testFiles/emptyVerilog.v');

        expect(response.status).toBe(400);
        expect(response.text).toBe('One or both uploaded files are empty.');
    });

    // Empty SDF file uploaded Test
    it('fail to uploads an empty SDF file (no file with content uploaded)', async () => {
        const response = await request(app)
        .post('/api/upload')
        .field('projectName', 'testProjectFailing')
        .attach('sdfFile', Buffer.from('test'), './testFiles/emptySDF.sdf')
        .attach('verilogFile', Buffer.from('test2'), './testFiles/exampleVerilog.v');

        expect(response.status).toBe(400);
        expect(response.text).toBe('One or both uploaded files are empty.');
    });

    // Empty Verilog file uploaded Test
    it('fail to uploads an empty Verilog file (no file with content uploaded)', async () => {
        const response = await request(app)
        .post('/api/upload')
        .field('projectName', 'testProjectFailing')
        .attach('sdfFile', Buffer.from('test'), './testFiles/exampleSDF.sdf')
        .attach('verilogFile', Buffer.from('test2'), './testFiles/emptyVerilog.v');

        expect(response.status).toBe(400);
        expect(response.text).toBe('One or both uploaded files are empty.');
    });

    // No project name given Test
    it('fail to uploads files without project name (no project name given)', async () => {
        const response = await request(app)
        .post('/api/upload')
        .attach('sdfFile', Buffer.from('test'), './testFiles/exampleSDF.sdf')
        .attach('verilogFile', Buffer.from('test2'), './testFiles/exampleVerilog.v');

        expect(response.status).toBe(400);
        expect(response.text).toBe('Project name is required.');
    });

    // Project already exist Test
    it('fail to uploads files (project already exists)', async () => {
        const response = await request(app)
        .post('/api/upload')
        .field('projectName', 'testProject')
        .attach('sdfFile', Buffer.from('test'), './testFiles/exampleSDF.sdf')
        .attach('verilogFile', Buffer.from('test2'), './testFiles/exampleVerilog.v');

        expect(response.status).toBe(400);
        expect(response.text).toBe('The project already exists.');
    });

    // Uploading files that doesn't exist Test
    it('fail to uploads an SDF and a Verilog files that doesn\'t exist (file doesn\'t exist)', async () => {
        const response = await request(app)
        .post('/api/upload')
        .field('projectName', 'testProjectFailing')
        .attach('sdfFile', Buffer.from('test'), './testFiles/nonExistent.sdf')
        .attach('verilogFile', Buffer.from('test'), './testFiles/nonExistent.v');

        expect(response.status).toBe(404);
        expect(response.text).toBe('File not found.');
    });

    // Uploading a Verilog file that doesn't exist Test
    it('fail to uploads an SDF and a Verilog files that doesn\'t exist (file doesn\'t exist)', async () => {
        const response = await request(app)
        .post('/api/upload')
        .field('projectName', 'testProjectFailing')
        .attach('sdfFile', Buffer.from('test'), './testFiles/exampleSDF.sdf')
        .attach('verilogFile', Buffer.from('test'), './testFiles/nonExistent.v');

        expect(response.status).toBe(404);
        expect(response.text).toBe('File not found.');
    });

    // Uploading a SDF file that doesn't exist Test
    it('fail to uploads an SDF and a Verilog files that doesn\'t exist (file doesn\'t exist)', async () => {
        const response = await request(app)
        .post('/api/upload')
        .field('projectName', 'testProjectFailing')
        .attach('sdfFile', Buffer.from('test'), './testFiles/nonExistent.sdf')
        .attach('verilogFile', Buffer.from('test'), './testFiles/exampleVerilog.v');

        expect(response.status).toBe(404);
        expect(response.text).toBe('File not found.');
    });

    // Uploading invalid files format Test
    it('fails to uploads an SDF and a Verilog files with the wrong format (invalid file format)', async () => {
        const response = await request(app)
        .post('/api/upload')
        .field('projectName', 'testProjectFailing')
        .attach('sdfFile', Buffer.from('test'), './testFiles/invalidSDFFormat.txt')
        .attach('verilogFile', Buffer.from('test'), './testFiles/invalidVerilogFormat.txt');

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid file(s) format.');
    });

    // Uploading invalid SDF file format Test
    it('fails to uploads an SDF file with the wrong format (invalid file format)', async () => {
        const response = await request(app)
        .post('/api/upload')
        .field('projectName', 'testProjectFailing')
        .attach('sdfFile', Buffer.from('test'), './testFiles/invalidSDFFormat.txt')
        .attach('verilogFile', Buffer.from('test'), './testFiles/exampleVerilog.v');

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid file(s) format.');
    });

    // Uploading invalid Verilog file format Test
    it('fails to uploads a Verilog file with the wrong format (invalid file format)', async () => {
        const response = await request(app)
        .post('/api/upload')
        .field('projectName', 'testProjectFailing')
        .attach('sdfFile', Buffer.from('test'), './testFiles/exampleSDF.sdf')
        .attach('verilogFile', Buffer.from('test'), './testFiles/invalidVerilogFormat.txt');

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid file(s) format.');
    });

    // Uploading 2 times an SDF file format Test
    it('fails to uploads 2 times the same SDF file (uploading 2 times the same file)', async () => {
        const response = await request(app)
        .post('/api/upload')
        .field('projectName', 'testProjectFailing')
        .attach('sdfFile', Buffer.from('test'), './testFiles/exampleSDF.sdf')
        .attach('verilogFile', Buffer.from('test2'), './testFiles/exampleSDF.sdf');

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid file(s) format.');
    });

    // Uploading 2 times a Verilog file format Test
    it('fails to uploads 2 times the same Verilog file (uploading 2 times the same file)', async () => {
        const response = await request(app)
        .post('/api/upload')
        .field('projectName', 'testProjectFailing')
        .attach('sdfFile', Buffer.from('test'), './testFiles/exampleVerilog.v')
        .attach('verilogFile', Buffer.from('test2'), './testFiles/exampleVerilog.v');

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid file(s) format.');
    });

    // Uploading 2 times a wrong file format Test
    it('fails to uploads 2 times the same wrong format file (uploading 2 times the same file)', async () => {
        const response = await request(app)
        .post('/api/upload')
        .field('projectName', 'testProjectFailing')
        .attach('sdfFile', Buffer.from('test'), './testFiles/invalidSDFFormat.txt')
        .attach('verilogFile', Buffer.from('test2'), './testFiles/invalidSDFFormat.txt');

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid file(s) format.');
    });


    // ! ||--------------------------------------------------------------------------------||
    // ! ||                           In GET /api/map/:projectName test:                          ||
    // ! ||--------------------------------------------------------------------------------||

    // Normal Conditions Test
    it('successfully fetch a project file', async () => {
        const response = await request(app).get('/api/map/testProject');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
    });

    // Project not found Test
    it('fail to fetch a project that doesn\'t exist (project not found)', async () => {
        const response = await request(app).get('/api/map/nonExistent');
        expect(response.status).toBe(404);
        expect(response.text).toBe('Project not found.');
    });   
    
    // Project name not given Test
    it('fail to fetch a project without passing the project\'s name (project name is required)', async () => {
        const response = await request(app).get('/api/map/');
        expect(response.status).toBe(400);
        expect(response.text).toBe('Project name is required.');
    });   
    
    // ! ||--------------------------------------------------------------------------------||
    // ! ||                             In GET /api/list test:                             ||
    // ! ||--------------------------------------------------------------------------------||

    // Normal Conditions Test
    it('successfully fetch the list of all projects', async () => {
        const response = await request(app).get('/api/list');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);

        // Parse and validate the response
        const data = JSON.parse(response.text);
        
        // Type checking
        expect(Array.isArray(data)).toBe(true);
        data.forEach(item => {
            expect(typeof item).toBe('string');
        });

        // Content validation
        expect(data).toEqual(["testProject"]);
    });

    // ! ||--------------------------------------------------------------------------------||
    // ! ||                   In DELETE /api/delete-project/:projectName test:                   ||
    // ! ||--------------------------------------------------------------------------------||

    // Normal Conditions Test
    it('successfully deletes the parsed JSON file', async () => {
        const response = await request(app).delete('/api/delete/testProject');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Project deleted successfully.');
    });

    // Project not found Test
    it('fail to delete the parsed JSON file (file not found)', async () => {
        const response = await request(app).delete('/api/delete/nonExistent');
        expect(response.status).toBe(404);
        expect(response.text).toBe('Project does not exist.');
    });
});