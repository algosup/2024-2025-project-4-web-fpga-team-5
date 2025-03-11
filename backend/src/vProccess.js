export const parseVerilog = (verilogContent) => {
    const moduleRegex = /module\s+(\w+)\s*\(([^)]*)\)\s*;/gs;
    const instanceRegex = /(\w+)\s+(\w+)\s*\(([^)]*)\)\s*;/g;
    const portRegex = /(input|output|inout|wire|reg)?\s*(\w+)/g;

    let parsedData = { modules: {}, instances: [] };

    let match;
    
    // Module extraction
    while ((match = moduleRegex.exec(verilogContent)) !== null) {
        const moduleName = match[1];
        const portList = match[2].replace(/\s+/g, ' '); // Cleaning spaces
        
        let ports = [];
        let portMatch;
        while ((portMatch = portRegex.exec(portList)) !== null) {
            ports.push({ type: portMatch[1] || 'wire', name: portMatch[2] });
        }

        parsedData.modules[moduleName] = { ports };
    }

    // instance extraction
    while ((match = instanceRegex.exec(verilogContent)) !== null) {
        const moduleType = match[1];
        const instanceName = match[2];

        // Check if connections are named `.clk(clk_signal)`
        let connections = [];
        let connectionsList = match[3].split(',').map(c => c.trim()).filter(c => c);
        connectionsList.forEach(conn => {
            const namedMatch = conn.match(/\.(\w+)\((\w+)\)/);
            if (namedMatch) {
                connections.push({ port: namedMatch[1], signal: namedMatch[2] });
            } else {
                connections.push({ signal: conn }); // If not named, we just keep the signal
            }
        });

        parsedData.instances.push({ moduleType, instanceName, connections });
    }

    return parsedData;
};
