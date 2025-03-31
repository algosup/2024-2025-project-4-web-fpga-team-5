// import function to clean instance names
import { cleanInstanceName } from './utils.js';

// Helper function to split a connection string into device and IO parts
const splitIntoDeviceAndIO = (connectionString) => {
  // This regex pattern looks for strings ending with input_X_X or output_X_X pattern
  const match = connectionString.match(/(.+)_(input|output|clock)_(\d+)_(\d+)$/);

  if (match) {
    return {
      device: match[1],
      io: `${match[2]}_${match[3]}_${match[4]}`
    };
  }

  // If no pattern is matched, return the original string as device and empty IO
  return {
    device: connectionString,
    io: ""
  };
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

    // Split the from and to into device and IO parts
    const fromParts = splitIntoDeviceAndIO(fromClean);
    const toParts = splitIntoDeviceAndIO(toClean);

    result.modules[moduleName].connections.push({
      "from": fromClean,
      "to": toClean,
      "fromDevice": fromParts.device,
      "fromIO": fromParts.io,
      "toDevice": toParts.device,
      "toIO": toParts.io
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

    // Split the datain and dataout into device and IO parts
    const fromParts = splitIntoDeviceAndIO(datain);
    const toParts = splitIntoDeviceAndIO(dataout);

    result.modules[moduleName].instances.push({
      "type": "fpga_interconnect",
      "name": instanceName,
      "connections": [
        {
          "fromDevice": fromParts.device,
          "fromIO": fromParts.io,
          "toDevice": toParts.device,
          "toIO": toParts.io
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

      const dPort = dMatch ? cleanInstanceName(dMatch[1]) : null;
      const qPort = qMatch ? cleanInstanceName(qMatch[1]) : null;
      const clkPort = clkMatch ? cleanInstanceName(clkMatch[1]) : null;

      console.log(`  Port D: ${dPort || 'Not found'}`);
      console.log(`  Port Q: ${qPort || 'Not found'}`);
      console.log(`  Port clock: ${clkPort || 'Not found'}`);

      // Add connections if ports were found
      const dffInstance = {
        "type": cellType,
        "name": cellName
      };

      result.modules[moduleName].instances.push(dffInstance);
      console.log(`  DFF added with connections`);
    }
    else if (cellType === "LUT_K") {
      lutCount++;
      console.log(`Processing LUT_K #${lutCount}: ${cellName}`);

      // Parse LUT_K parameters
      const kMatch = paramsText.match(/\.K\(([^)]+)\)/);
      const maskMatch = paramsText.match(/\.LUT_MASK\(([^)]+)\)/);

      console.log(`  Parameter K: ${kMatch ? kMatch[1] : 'Not found'}`);
      console.log(`  Parameter LUT_MASK: ${maskMatch ? maskMatch[1] : 'Not found'}`);

      // Add LUT_K instance with parameters and connections
      const lutInstance = {
        "type": cellType,
        "name": cellName
      };

      // Add K and LUT_MASK parameters if found
      if (kMatch) {
        lutInstance.K = kMatch[1].trim();
      }
      if (maskMatch) {
        lutInstance.LUT_MASK = maskMatch[1].trim();
      }

      // Parse input and output ports for LUT_K
      const inputRegex = /\.I(\d)\(\\([^)]+)\)/g;
      let inputMatch;
      while ((inputMatch = inputRegex.exec(portsText)) !== null) {
        const inputNum = inputMatch[1];
        const inputSignal = cleanInstanceName(inputMatch[2]);
        const inputParts = splitIntoDeviceAndIO(inputSignal);

        console.log(`  Input I${inputNum}: ${inputSignal}`);
      }

      // Parse output port for LUT_K
      const outputMatch = portsText.match(/\.O\(\\([^)]+)\)/);
      if (outputMatch) {
        const outputSignal = cleanInstanceName(outputMatch[1]);
        const outputParts = splitIntoDeviceAndIO(outputSignal);

        console.log(`  Output O: ${outputSignal}`);
      }

      result.modules[moduleName].instances.push(lutInstance);
      console.log(`  LUT_K added with connections`);
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