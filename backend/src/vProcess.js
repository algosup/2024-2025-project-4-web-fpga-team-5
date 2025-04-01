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
  // Initialize the result dictionary with the required structure
  const result = {
    "modules": {}
  };

  // Extract module name
  const moduleMatch = verilogText.match(/module\s+(\w+)\s*\(/);
  const moduleName = moduleMatch[1];

  result.modules[moduleName] = {
    "ports": [],
    "instances": [],
    "connections": []
  };

  // Extract ports
  const portSectionRegex = /\((.*?)\);/s;
  const portSection = verilogText.match(portSectionRegex);
  if (portSection) {
    const portText = portSection[1];

    // Extract input ports
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
    }

    // Extract output ports
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
    }
  }

  // Extract IO assignments (connections between ports and internal signals)
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
  }

  // Extract interconnects
  const interconnectPattern = /fpga_interconnect\s+\\([^(]+)\s*\(\s*\.datain\(\\([^)]+)\),\s*\.dataout\(\\([^)]+)\)\s*\);/g;
  let interconnectMatch;
  let interconnectCount = 0;
  while ((interconnectMatch = interconnectPattern.exec(verilogText)) !== null) {
    interconnectCount++;
    const instanceName = cleanInstanceName(interconnectMatch[1]);
    const datain = cleanInstanceName(interconnectMatch[2]);
    const dataout = cleanInstanceName(interconnectMatch[3]);

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

  // Extract cell instances (like DFF and LUT_K)
  const cellPattern = /(\w+)\s+#\(\s*(.*?)\)\s*\\([^(]+)\s*\(\s*(.*?)\);/gs;
  let cellMatch;
  let dffCount = 0;
  let lutCount = 0;
  let otherCellCount = 0;

  while ((cellMatch = cellPattern.exec(verilogText)) !== null) {
    const cellType = cellMatch[1];
    const paramsText = cellMatch[2];
    const cellName = cleanInstanceName(cellMatch[3]);

    if (cellType === "DFF") {
      dffCount++;

      // Add connections if ports were found
      const dffInstance = {
        "type": cellType,
        "name": cellName
      };

      result.modules[moduleName].instances.push(dffInstance);
    }
    else if (cellType === "LUT_K") {
      lutCount++;

      // Parse LUT_K parameters
      const kMatch = paramsText.match(/\.K\(([^)]+)\)/);
      const maskMatch = paramsText.match(/\.LUT_MASK\(([^)]+)\)/);

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
      result.modules[moduleName].instances.push(lutInstance);
    } else {
      otherCellCount++;
    }
  }

  return result;
}