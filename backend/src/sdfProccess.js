// Function to parse SDF file content and return a JSON object

export const parseSDF = (fileContent) => {
    const sdfData = { instances: [] };

    const instanceRegex = /\(INSTANCE\s+([^\)]+)\)/g;
    const iopathRegex = /\(IOPATH\s+([^\)]+)\s+([^\)]+)\s+\(([^:]+):([^:]+):([^\)]+)\)\s+\(([^:]+):([^:]+):([^\)]+)\)\)/g;

    const instancesMap = new Map();

    // Extraire les instances
    let match;
    while ((match = instanceRegex.exec(fileContent)) !== null) {
        const instanceName = match[1];
        const instance = { name: instanceName, iopaths: [] };
        sdfData.instances.push(instance);
        instancesMap.set(instanceName, instance);
    }

    // Extraire les IOPATHs et les associer aux instances
    while ((match = iopathRegex.exec(fileContent)) !== null) {
        const [_, from, to, minDelay, typDelay, maxDelay, minSlew, typSlew, maxSlew] = match;
        
        // Associer l'IOPATH à la dernière instance trouvée
        const lastInstance = sdfData.instances[sdfData.instances.length - 1];
        if (lastInstance) {
            lastInstance.iopaths.push({
                from,
                to,
                delays: { min: minDelay, typ: typDelay, max: maxDelay },
                slews: { min: minSlew, typ: typSlew, max: maxSlew }
            });
        }
    }

    return sdfData;
}