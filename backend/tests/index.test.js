import request from 'supertest';
import { expect, it, jest } from '@jest/globals';
import { app, server } from '../index.js';

// Mock SDF parsing
jest.mock('../src/sdfProccess.js', () => ({
    parseSDF: jest.fn(),
}));

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
    // ! ||                            In POST /api/sdf/upload test:                           ||
    // ! ||--------------------------------------------------------------------------------||

    // Normal Conditions Test
    it('successfully uploads and parses an SDF file', async () => {
        const response = await request(app)
        .post('/api/sdf/upload')
        .attach('sdfFile', Buffer.from('test'), './testFiles/exampleSDF.sdf');

        expect(response.status).toBe(200);
        expect(response.text).toBe('File parsed and JSON saved successfully.');
    });

    // No file uploaded Test
    it('fail to uploads and parses an SDF file (no file uploaded)', async () => {
        const response = await request(app)
        .post('/api/sdf/upload');

        expect(response.status).toBe(400);
        expect(response.text).toBe('No file uploaded.');
    });

    // File already exists Test
    it('fail to uploads and parses an SDF file (file already exists)', async () => {
        const response = await request(app)
        .post('/api/sdf/upload')
        .attach('sdfFile', Buffer.from('test'), './testFiles/exampleSDF.sdf');

        expect(response.status).toBe(400);
        expect(response.text).toBe('File already exists.');
    });

    // Uploading a file that doesn't exist Test
    it('fail to uploads and parses an SDF file (file not found)', async () => {
        const response = await request(app)
        .post('/api/sdf/upload')
        .attach('sdfFile', Buffer.from('test'), './testFiles/nonExistent.sdf');

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error parsing SDF file.');
    });

    // Uploading invalid file format Test
    it('fail to uploads and parses an SDF file (invalid file format)', async () => {
        const response = await request(app)
        .post('/api/sdf/upload')
        .attach('sdfFile', Buffer.from('test'), './testFiles/invalidFormat.txt');

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid file type, only .sdf files are allowed!');
    });

    // ! ||--------------------------------------------------------------------------------||
    // ! ||                           In GET /api/sdf/map/:filename test:                          ||
    // ! ||--------------------------------------------------------------------------------||

    // Normal Conditions Test
    it('successfully fetch a parsed JSON file', async () => {
        const response = await request(app).get('/api/sdf/map/exampleSDF.sdf');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
    });

    // File not found Test
    it('fail to fetch a parsed JSON file (file not found)', async () => {
        const response = await request(app).get('/api/sdf/map/nonExistent.sdf');
        expect(response.status).toBe(500);
        expect(response.text).toBe('Error reading parsed SDF JSON file. File may not exist.');
    });    
    
    // ! ||--------------------------------------------------------------------------------||
    // ! ||                             In GET /list-sdf test:                             ||
    // ! ||--------------------------------------------------------------------------------||

    // Normal Conditions Test
    it('successfully fetch the list of all SDF files', async () => {
        const response = await request(app).get('/api/sdf/list');
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
        expect(data).toEqual(["exampleSDF.sdf"]);
    });

    // ! ||--------------------------------------------------------------------------------||
    // ! ||                   In DELETE /api/sdf/delete-json/:filename test:                   ||
    // ! ||--------------------------------------------------------------------------------||

    // Normal Conditions Test
    it('successfully deletes the parsed JSON file', async () => {
        const response = await request(app).delete('/api/sdf/delete-json/exampleSDF.sdf');
        expect(response.status).toBe(200);
        expect(response.text).toBe('SDF JSON file deleted successfully.');
    });

    // File not found Test
    it('fail to delete the parsed JSON file (file not found)', async () => {
        const response = await request(app).delete('/api/sdf/delete-json/nonExistent.sdf');
        expect(response.status).toBe(500);
        expect(response.text).toBe('Error deleting SDF JSON file, the file may not exists.');
    });

});