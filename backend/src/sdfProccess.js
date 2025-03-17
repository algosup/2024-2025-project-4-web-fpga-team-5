// Clean instance name
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

export const parseSDF = (sdfContent) => {
  console.log("Starting SDF file analysis...");

  // Extracting basic information
  console.log("Extracting design name...");
  const designMatch = sdfContent.match(/\(DESIGN\s+"([^"]+)"\)/);
  const design = designMatch ? designMatch[1] : "";
  console.log(`Design name found: ${design}`);

  console.log("Extracting timescale...");
  const timescaleMatch = sdfContent.match(/\(TIMESCALE\s+(\d+)\s+(\w+)\)/);
  const timescale = timescaleMatch ? parseInt(timescaleMatch[1]) : 1;
  const timeUnit = timescaleMatch ? timescaleMatch[2] : "ps";
  console.log(`Timescale found: ${timescale} ${timeUnit}`);

  // Extracting cells
  const instances = [];

  console.log("Searching for CELL sections...");
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

  console.log(`Number of CELL sections found: ${cellMatches.length}`);

  for (let i = 0; i < cellMatches.length; i++) {
    const cellType = cellMatches[i].cellType;
    const rawInstanceName = cellMatches[i].rawInstanceName;

    // Clean the instance name
    const instanceName = cleanInstanceName(rawInstanceName);

    console.log(`\nProcessing cell ${i + 1}/${cellMatches.length}: ${instanceName} (Type: ${cellType})`);

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
      console.log(`  Specific processing for DFF: ${instanceName}`);

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

        console.log(`  DFF IOPATH found with delay: ${delayValue}`);
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

        console.log(`  Setup found with time: ${setupTime}`);
        cellData.timingChecks = setupTime;
      }
    } else {
      // Standard processing for other cell types
      console.log(`  Searching for IOPATH delays for ${instanceName}...`);

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

        console.log(`  IOPATH found: ${fromPin} -> ${toPin}, Delay: ${delayValue}`);

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

  console.log("\nBuilding the final result...");
  // Building the final result
  const result = {
    design: design,
    timescale: timescale,
    timeUnit: timeUnit,
    instances: instances
  };

  const dffCount = instances.filter(instance => instance.cellType === "DFF").length;
  console.log(`Analysis complete. ${instances.length} instances extracted, including ${dffCount} DFF.`);
  return result;
}
