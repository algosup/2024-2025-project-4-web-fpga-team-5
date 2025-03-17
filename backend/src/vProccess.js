const cleanInstanceName = (name) => {
  // Trim any leading or trailing spaces
  name = name.trim();
  
  // Replace escape sequences to match SDF format
  name = name.replace(/\\\$/g, '$');     
  name = name.replace(/\\\./g, '.');     
  name = name.replace(/\\:/g, ':');      
  name = name.replace(/\\~/g, '~');      
  name = name.replace(/\\\^/g, '^');       

  return name;
}
export const parseVerilog = (verilogText) => {
  console.log("Starting Verilog file analysis...");
  console.log(`Length of Verilog text: ${verilogText.length} characters`);

  // Initialize the result dictionary with the required structure
  const result = {
    "modules": {}
  };

  // Extract module name
  console.log("Searching for module name...");
  const moduleMatch = verilogText.match(/module\s+(\w+)\s*\(/);
  if (!moduleMatch) {
    console.warn("Warning: No module name found.");
    return result;
  }

  const moduleName = moduleMatch[1];
  console.log(`Module found: ${moduleName}`);

  result.modules[moduleName] = {
    "ports": [],
    "instances": [],
    "connections": []
  };

  // Extract ports
  console.log("Extracting ports...");
  const portSectionRegex = /\((.*?)\);/s;
  const portSection = verilogText.match(portSectionRegex);
  if (portSection) {
    const portText = portSection[1];
    console.log(`Port section found: ${portText.substring(0, 50)}...`);

    // Extract input ports
    console.log("Searching for input ports...");
    const inputPortRegex = /input\s+\\(\w+)\s*,?/g;
    let inputPortMatch;
    let inputCount = 0;
    while ((inputPortMatch = inputPortRegex.exec(portText)) !== null) {
      inputCount++;
      const cleanName = cleanInstanceName(inputPortMatch[1]);
      result.modules[moduleName].ports.push({
        "type": "input",
        "name": cleanName
      });
      console.log(`Input port found: ${cleanName}`);
    }
    console.log(`Total input ports found: ${inputCount}`);

    // Extract output ports
    console.log("Searching for output ports...");
    const outputPortRegex = /output\s+\\(\w+)\s*,?/g;
    let outputPortMatch;
    let outputCount = 0;
    while ((outputPortMatch = outputPortRegex.exec(portText)) !== null) {
      outputCount++;
      const cleanName = cleanInstanceName(outputPortMatch[1]);
      result.modules[moduleName].ports.push({
        "type": "output",
        "name": cleanName
      });
      console.log(`Output port found: ${cleanName}`);
    }
    console.log(`Total output ports found: ${outputCount}`);
  } else {
    console.warn("No port section found.");
  }

  // Extract IO assignments (connections between ports and internal signals)
  console.log("Extracting IO assignments...");
  const ioAssignmentRegex = /assign\s+\\([^=]+)\s*=\s*\\([^;]+);/g;
  let ioAssignmentMatch;
  let assignCount = 0;
  while ((ioAssignmentMatch = ioAssignmentRegex.exec(verilogText)) !== null) {
    assignCount++;
    const fromClean = cleanInstanceName(ioAssignmentMatch[2].trim());
    const toClean = cleanInstanceName(ioAssignmentMatch[1].trim());

    result.modules[moduleName].connections.push({
      "from": fromClean,
      "to": toClean
    });
    console.log(`Assignment found: ${fromClean} -> ${toClean}`);
  }
  console.log(`Total assignments found: ${assignCount}`);

  // Extract interconnects
  console.log("Extracting interconnects...");
  const interconnectPattern = /fpga_interconnect\s+\\([^(]+)\s*\(\s*\.datain\(\\([^)]+)\),\s*\.dataout\(\\([^)]+)\)\s*\);/g;
  let interconnectMatch;
  let interconnectCount = 0;
  while ((interconnectMatch = interconnectPattern.exec(verilogText)) !== null) {
    interconnectCount++;
    const instanceName = cleanInstanceName(interconnectMatch[1]);
    const datain = cleanInstanceName(interconnectMatch[2]);
    const dataout = cleanInstanceName(interconnectMatch[3]);

    console.log(`Interconnect found: ${instanceName} (${datain} -> ${dataout})`);

    result.modules[moduleName].instances.push({
      "type": "fpga_interconnect",
      "name": instanceName,
      "connections": [
        {
          "from": datain,
          "to": dataout
        }
      ]
    });
  }
  console.log(`Total interconnects found: ${interconnectCount}`);

  // Extract cell instances (like DFF and LUT_K)
  console.log("Extracting cell instances...");
  const cellPattern = /(\w+)\s+#\(\s*(.*?)\)\s*\\([^(]+)\s*\(\s*(.*?)\);/gs;
  let cellMatch;
  let dffCount = 0;
  let lutCount = 0;
  let otherCellCount = 0;

  while ((cellMatch = cellPattern.exec(verilogText)) !== null) {
    const cellType = cellMatch[1];
    const paramsText = cellMatch[2];
    const cellName = cleanInstanceName(cellMatch[3]);
    const portsText = cellMatch[4];

    console.log(`Cell found: Type=${cellType}, Name=${cellName}`);
    console.log(`  Parameters: ${paramsText.substring(0, 50)}...`);
    console.log(`  Ports: ${portsText.substring(0, 50)}...`);

    if (cellType === "DFF") {
      dffCount++;
      console.log(`Processing DFF #${dffCount}: ${cellName}`);

      // Parse DFF ports
      const dMatch = portsText.match(/\.D\(\\([^)]+)\)/);
      const qMatch = portsText.match(/\.Q\(\\([^)]+)\)/);
      const clkMatch = portsText.match(/\.clock\(\\([^)]+)\)/);

      console.log(`  Port D match: ${dMatch ? dMatch[1] : 'Not found'}`);
      console.log(`  Port Q match: ${qMatch ? qMatch[1] : 'Not found'}`);
      console.log(`  Port clock match: ${clkMatch ? clkMatch[1] : 'Not found'}`);

      const connections = [];
      if (dMatch && qMatch) {
        const dClean = cleanInstanceName(dMatch[1]);
        const qClean = cleanInstanceName(qMatch[1]);
        connections.push({
          "from": dClean,
          "to": qClean
        });
        console.log(`  Connection D-Q: ${dClean} -> ${qClean}`);
      }

      if (clkMatch) {
        // Find the source of the clock
        let clkSource = null;
        const clkName = cleanInstanceName(clkMatch[1]);
        console.log(`  Searching for clock signal source: ${clkName}`);

        for (const interconnect of result.modules[moduleName].instances) {
          if (interconnect.type === "fpga_interconnect") {
            for (const conn of interconnect.connections) {
              if (conn.to === clkName) {
                clkSource = conn.from;
                console.log(`  Clock source found: ${clkSource}`);
                break;
              }
            }
            if (clkSource) break;
          }
        }

        if (clkSource) {
          connections.push({
            "from": clkName,
            "to": clkSource
          });
          console.log(`  Clock connection: ${clkName} -> ${clkSource}`);
        } else {
          console.log(`  No clock source found for: ${clkName}`);
        }
      }

      result.modules[moduleName].instances.push({
        "type": cellType,
        "name": cellName,
        "connections": connections
      });
      console.log(`  DFF added with ${connections.length} connections`);
    }
    else if (cellType === "LUT_K") {
      lutCount++;
      console.log(`Processing LUT_K #${lutCount}: ${cellName}`);

      // Parse LUT_K parameters
      const kMatch = paramsText.match(/\.K\(([^)]+)\)/);
      const maskMatch = paramsText.match(/\.LUT_MASK\(([^)]+)\)/);

      console.log(`  Parameter K: ${kMatch ? kMatch[1] : 'Not found'}`);
      console.log(`  Parameter LUT_MASK: ${maskMatch ? maskMatch[1] : 'Not found'}`);

      // Parse LUT_K ports
      const inRegExp = /\.in\(\{([^}]+)\}/;
      const inMatch = portsText.match(inRegExp);

      console.log(`  Inputs match: ${inMatch ? inMatch[1].substring(0, 50) + '...' : 'Not found'}`);

      const inPorts = inMatch ? inMatch[1].split(',').map(p => {
        const match = p.trim().match(/\\([^,]+)/);
        return match ? match[1] : null;
      }).filter(Boolean) : [];

      console.log(`  Inputs found: ${inPorts.length}`);
      inPorts.forEach((port, i) => console.log(`    Input ${i}: ${port}`));

      const outMatch = portsText.match(/\.out\(\\([^)]+)\)/);
      console.log(`  Output port: ${outMatch ? outMatch[1] : 'Not found'}`);

      const connections = [];
      if (outMatch) {
        const outName = cleanInstanceName(outMatch[1]);
        console.log(`  Cleaned output: ${outName}`);

        for (let inPort of inPorts) {
          if (inPort.trim() !== "1'b0" && inPort.trim() !== "1'b1") {  // Skip constant values
            // Remove the "lut_" prefix from LUT input names if present
            let inName = cleanInstanceName(inPort.trim());
            if (inName.startsWith("lut_")) {
              inName = inName.substring(4);
              console.log(`  Removed 'lut_' prefix: ${inName}`);
            }
            connections.push({
              "from": inName,
              "to": outName
            });
            console.log(`  Connection added: ${inName} -> ${outName}`);
          } else {
            console.log(`  Skipping constant value: ${inPort}`);
          }
        }
      }

      // Add parameters to the LUT_K instance
      const lutInstance = {
        "type": cellType,
        "name": cellName,
        "connections": connections
      };

      // Add K and LUT_MASK parameters if found
      if (kMatch) {
        lutInstance.K = kMatch[1].trim();
      }
      if (maskMatch) {
        lutInstance.LUT_MASK = maskMatch[1].trim();
      }

      result.modules[moduleName].instances.push(lutInstance);
      console.log(`  LUT_K added with ${connections.length} connections`);
    } else {
      otherCellCount++;
      console.log(`Unknown cell type ignored: ${cellType}`);
    }
  }

  console.log(`Total cells found: DFF=${dffCount}, LUT_K=${lutCount}, Others=${otherCellCount}`);

  // Final summary
  console.log("\nPARSING SUMMARY:");
  console.log(`Module: ${moduleName}`);
  console.log(`Ports: ${result.modules[moduleName].ports.length}`);
  console.log(`Instances: ${result.modules[moduleName].instances.length}`);
  console.log(`Connections: ${result.modules[moduleName].connections.length}`);
  console.log("Parsing completed.");

  return result;
}
