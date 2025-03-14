// Function to parse Verilog file content and return a JSON object

export const parseVerilog = (verilogContent) => {
    const moduleRegex = /module\s+(\w+)\s*\(([^)]*)\)\s*;/gs;
    const instanceRegex = /(\w+)\s+(\w+)\s*\(([^)]*)\)\s*;/g;
    const portRegex = /(input|output|inout|wire|reg)\s+([\w\\]+)/g;

    let parsedData = { modules: {}, instances: [] };

    let match;

    // Modules & ports extraction
    while ((match = moduleRegex.exec(verilogContent)) !== null) {
        const moduleName = match[1];
        const portList = match[2];

        let ports = [];
        let portMatch;
        while ((portMatch = portRegex.exec(portList)) !== null) {
            ports.push({ type: portMatch[1], name: portMatch[2].replace(/\\/g, '') });
        }

        parsedData.modules[moduleName] = { ports };
    }

    // Instances & connections extraction
    while ((match = instanceRegex.exec(verilogContent)) !== null) {
        const moduleType = match[1];
        const instanceName = match[2];

        let connections = [];
        let connectionsList = match[3].split(',').map(c => c.trim()).filter(c => c);
        connectionsList.forEach(conn => {
            const namedMatch = conn.match(/\.(\w+)\(([\w\\]+)\)/);
            if (namedMatch) {
                let portName = namedMatch[1];
                let signalName = namedMatch[2].replace(/\\/g, '');

                // Dertermines port type
                let portType = parsedData.modules[moduleType]?.ports.find(p => p.name === portName)?.type || "unknown";

                // Save connection
                connections.push({ port: portName, signal: signalName, direction: portType });
            } else {
                // Signal extraction
                let [portType, signalName] = conn.split(" ");
                if (!signalName) { 
                    signalName = portType; 
                    portType = "unknown"; 
                }

                connections.push({ signal: signalName.replace(/\\/g, ''), direction: portType });
            }
        });

        parsedData.instances.push({ moduleType, instanceName, connections });
    }

    return parsedData;
};
