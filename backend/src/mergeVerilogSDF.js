export const mergeJsonForD3 = (verilogData, sdfData) => {
    // Clone Verilog JSON to avoid modifying the original
    let finalJSON = JSON.parse(JSON.stringify(verilogData));

    // Create a map of SDF delays with normalized instance names
    let sdfInstancesMap = new Map();
    if (sdfData.instances && Array.isArray(sdfData.instances)) {
        sdfData.instances.forEach(inst => {
            if (inst && inst.instanceName) {
                // Normalize instance name
                const normalizedName = inst.instanceName.trim();
                sdfInstancesMap.set(normalizedName, inst);
            }
        });
    }

    console.log(`SDF: ${sdfInstancesMap.size} instances loaded`);

    // Iterate over all modules and their instances
    Object.values(finalJSON.modules).forEach(module => {
        if (module.instances && Array.isArray(module.instances)) {
            module.instances.forEach(instance => {
                if (!instance.name) {
                    console.log("Instance without name found");
                    return;
                }

                // Normalize Verilog instance name
                const normalizedName = instance.name.trim();
                const sdfInstance = sdfInstancesMap.get(normalizedName);

                if (sdfInstance) {
                    console.log(`Match found for: ${normalizedName}`);

                    // Case for DFF - delay is often a simple value
                    if (sdfInstance.cellType === "DFF") {
                        // Copy all delays and timing checks
                        instance.delays = sdfInstance.delays;
                        instance.timingChecks = sdfInstance.timingChecks;
                        console.log(`DFF: Delays added for ${normalizedName}: ${JSON.stringify(instance.delays)}`);
                    }
                    // Case for LUT_K - delays are often an array
                    else if (sdfInstance.cellType === "LUT_K") {
                        instance.delays = sdfInstance.delays;
                        console.log(`LUT_K: Delays added for ${normalizedName}`);
                    }
                    // Case for interconnections
                    else if (instance.type === "fpga_interconnect" && instance.connections) {
                        instance.connections.forEach(conn => {
                            // If delays are in an array
                            if (Array.isArray(sdfInstance.delays)) {
                                // For interconnections, we generally take the first delay
                                if (sdfInstance.delays.length > 0) {
                                    conn.delay = sdfInstance.delays[0].delay;
                                    console.log(`Interconnection: Delay added for ${normalizedName}: ${conn.delay}`);
                                }
                            }
                            // If delay is a simple value
                            else if (typeof sdfInstance.delays === "number") {
                                conn.delay = sdfInstance.delays;
                                console.log(`Interconnection: Simple delay added for ${normalizedName}: ${sdfInstance.delays}`);
                            }
                        });
                    }
                } else {
                    console.log(`No SDF match for: ${normalizedName}`);
                }
            });
        }
    });

    // Final check
    let delaysCount = 0;
    Object.values(finalJSON.modules).forEach(module => {
        if (module.instances) {
            module.instances.forEach(instance => {
                if (instance.delays || (instance.connections && instance.connections.some(c => c.delay))) {
                    delaysCount++;
                }
            });
        }
    });
    console.log(`Total number of instances with delays: ${delaysCount}`);

    return finalJSON;
};
