// import function to clean instance names
import { cleanInstanceName } from './utils.js';

export const parseSDF = (sdfContent) => {

  // Extracting basic information
  const designMatch = sdfContent.match(/\(DESIGN\s+"([^"]+)"\)/);
  const design = designMatch ? designMatch[1] : "";

  const timescaleMatch = sdfContent.match(/\(TIMESCALE\s+(\d+)\s+(\w+)\)/);
  const timescale = timescaleMatch ? parseInt(timescaleMatch[1]) : 1;
  const timeUnit = timescaleMatch ? timescaleMatch[2] : "ps";

  // Extracting cells
  const instances = [];
  const cellPattern = /\(CELL\s*\(CELLTYPE\s+"([^"]+)"\)\s*\(INSTANCE\s+([^\)]+)\)/g;

  // Collect all matches in an array
  const cellMatches = [];
  let cellMatch;
  while ((cellMatch = cellPattern.exec(sdfContent)) !== null) {
    cellMatches.push({
      match: cellMatch,
      index: cellMatch.index,
      cellType: cellMatch[1],
      rawInstanceName: cellMatch[2]
    });
  }

  for (let i = 0; i < cellMatches.length; i++) {
    const cellType = cellMatches[i].cellType;
    const rawInstanceName = cellMatches[i].rawInstanceName;

    // Clean the instance name
    const instanceName = cleanInstanceName(rawInstanceName);

    // Determine the end of this cell
    let endPos;
    if (i < cellMatches.length - 1) {
      endPos = cellMatches[i + 1].index;
    } else {
      endPos = sdfContent.length;
    }

    // Current cell content
    const startPos = cellMatches[i].match.index + cellMatches[i].match[0].length;
    const cellContent = sdfContent.substring(startPos, endPos);

    // Initialize cell data
    const cellData = {
      instanceName: instanceName,
      cellType: cellType
    };

    // For DFF, handle specifically
    if (cellType === "DFF") {
      // Search for IOPATH with posedge/negedge for DFF
      const dffIopathMatch = cellContent.match(/\(IOPATH\s+\(posedge\s+\w+\)\s+\w+\s+\(([^)]+)\)/);

      if (dffIopathMatch) {
        // Extract the delay triplet (min:typ:max)
        const delayTriplet = dffIopathMatch[1];
        // Take the typical value (middle) for the delay
        // Expected format: "min:typ:max"
        const delayParts = delayTriplet.split(':');
        let delayValue;
        if (delayParts.length >= 2) {
          // If it's a triplet, take the typical value (middle)
          delayValue = parseInt(delayParts[1]);
        } else {
          // If it's a single value
          delayValue = parseInt(delayParts[0]);
        }
        cellData.delays = delayValue;
      }

      // Search for TIMINGCHECK (SETUP) information
      const setupMatch = cellContent.match(/\(SETUP\s+\w+\s+\(posedge\s+\w+\)\s+\(([^)]+)\)\)/);

      if (setupMatch) {
        // Extract the triplet for the setup time
        const setupTriplet = setupMatch[1];
        // Process the "min:typ:max" triplet
        const setupParts = setupTriplet.split(':');
        let setupTime;
        if (setupParts.length >= 2) {
          // Take the typical value
          setupTime = parseFloat(setupParts[1]);
        } else {
          setupTime = parseFloat(setupParts[0]);
        }
        cellData.timingChecks = setupTime;
      }
    } else {
      // Standard IOPATH search
      const iopathPattern = /\(IOPATH\s+(\S+)\s+(\S+)\s+\(([^:)]+)(?::([^:)]+))?(?::([^)]+))?\)/g;

      let iopathMatch;
      let hasDelays = false;
      cellData.delays = [];

      while ((iopathMatch = iopathPattern.exec(cellContent)) !== null) {
        hasDelays = true;
        const fromPin = iopathMatch[1];
        const toPin = iopathMatch[2];

        // Extract the first delay value or take the typical value if it's a triplet
        const delayStr = iopathMatch[3];
        let delayValue;
        if (delayStr.includes(':')) {
          const delayParts = delayStr.split(':');
          delayValue = delayParts.length > 1 ? parseFloat(delayParts[1]) : parseFloat(delayParts[0]);
        } else {
          delayValue = parseFloat(delayStr);
        }

        cellData.delays.push({
          from: fromPin,
          to: toPin,
          delay: delayValue
        });
      }

      // If no delays found, clean up the structure
      if (!hasDelays && "delays" in cellData) {
        delete cellData.delays;
      }
    }

    // Add the cell to the result
    instances.push(cellData);
  }

  // Building the final result
  const result = {
    design: design,
    timescale: timescale,
    timeUnit: timeUnit,
    instances: instances
  };

  return result;
}