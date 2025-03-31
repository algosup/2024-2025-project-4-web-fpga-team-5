import * as d3 from "d3";

// Constants for visualization
const COLORS = {
  INPUT_PORT: "#6ab04c",  // Green for input ports
  OUTPUT_PORT: "#eb4d4b", // Red for output ports
  LUT: "#f0932b",         // Orange for LUTs
  DFF: "#686de0",         // Purple for DFFs
  INTERCONNECT: "#95a5a6", // Grey for inactive interconnects
  ACTIVE_PATH: "url(#active-gradient)", // Gradient for active paths
  PORT_STROKE: "#14002b",  // Dark border for ports
  COMPONENT_STROKE: "#14002b", // Dark border for components
  TEXT: "#14002b",        // Text color
};

const SIZES = {
  PORT_RADIUS: 5,
  LUT_WIDTH: 60,
  LUT_HEIGHT: 40,
  DFF_WIDTH: 60,
  DFF_HEIGHT: 30,
  FONT_SIZE: 10,
};

// Initialize SVG and D3 visualization
export function setupVisualization(data, containerRef, svgRef, zoomLevel, showLabels) {
  if (!data || !containerRef.current) return;

  // Clear previous visualization
  d3.select(containerRef.current).selectAll("svg").remove();

  // Extract module data - for now we'll just use the first module in the data
  const moduleName = Object.keys(data.modules)[0];
  const moduleData = data.modules[moduleName];

  // Create new SVG
  const containerWidth = containerRef.current.clientWidth;
  const containerHeight = containerRef.current.clientHeight;

  const svg = d3.select(containerRef.current)
    .append("svg")
    .attr("width", containerWidth)
    .attr("height", containerHeight)
    .attr("viewBox", [0, 0, containerWidth, containerHeight]);

  // Store reference to svg
  svgRef.current = svg.node();

  // Create a gradient for active paths
  const defs = svg.append("defs");
  const gradient = defs.append("linearGradient")
    .attr("id", "active-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#0984e3");

  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#2ecc71");

  // Create main group for panning and zooming
  const g = svg.append("g")
    .attr("transform", `translate(${containerWidth / 2}, ${containerHeight / 2}) scale(${zoomLevel})`);

  // Setup zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([0.1, 10])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

  svg.call(zoom);

  // If a specific zoomLevel was provided, apply it
  if (zoomLevel !== 1) {
    svg.call(zoom.transform, d3.zoomIdentity.translate(containerWidth / 2, containerHeight / 2).scale(zoomLevel));
  }

  // Organize components for layout
  const { components, graph } = organizeComponents(moduleData);

  // Draw connections (first, so they're behind components)
  drawConnections(g, components, graph);

  // Draw components
  drawComponents(g, components, showLabels);
}

// Organize components for visualization layout
function organizeComponents(moduleData) {
  // Extract ports, LUTs, DFFs, and interconnects
  const ports = moduleData.ports.map(port => ({
    id: port.name,
    type: port.type === "input" ? "INPUT_PORT" : "OUTPUT_PORT",
    name: port.name,
    connections: []
  }));

  // Create mapping of all component instances
  const components = {};

  // Add ports to components
  ports.forEach(port => {
    components[port.id] = port;
  });

  // Add other component instances (LUTs, DFFs, etc.)
  moduleData.instances.forEach(instance => {
    if (instance.type === "fpga_interconnect") {
      // Handle interconnects differently as they're edges in our graph
      return;
    }

    components[instance.name] = {
      id: instance.name,
      type: instance.type === "LUT_K" ? "LUT" :
        instance.type === "DFF" ? "DFF" : "OTHER",
      name: instance.name,
      connections: [],
      data: instance
    };
  });

  // Build connection graph
  const graph = {
    nodes: Object.values(components),
    edges: []
  };

  // Process interconnects to build edges
  moduleData.instances
    .filter(instance => instance.type === "fpga_interconnect")
    .forEach(interconnect => {
      interconnect.connections.forEach(conn => {
        // Get source and target nodes
        const fromDevice = conn.fromDevice;
        const fromIO = conn.fromIO;
        const toDevice = conn.toDevice;
        const toIO = conn.toIO;
        const delay = conn.delay || 0;

        // Create a unique identifier for this connection
        const edgeId = `${fromDevice}_${fromIO}_to_${toDevice}_${toIO}`;

        // Add edge to graph
        graph.edges.push({
          id: edgeId,
          source: fromDevice,
          sourceIO: fromIO,
          target: toDevice,
          targetIO: toIO,
          delay: delay,
          name: interconnect.name
        });

        // Add connection references to components
        if (components[fromDevice]) {
          components[fromDevice].connections.push({
            type: "output",
            io: fromIO,
            edge: edgeId
          });
        }

        if (components[toDevice]) {
          components[toDevice].connections.push({
            type: "input",
            io: toIO,
            edge: edgeId
          });
        }
      });
    });

  // Calculate positions for components using a force-directed layout
  const componentSpacing = 100;
  const layers = calculateLayers(graph);

  // Position nodes based on layers
  let maxLayerSize = 0;
  Object.values(layers).forEach(layer => {
    maxLayerSize = Math.max(maxLayerSize, layer.length);
  });

  const layerKeys = Object.keys(layers).sort((a, b) => parseInt(a) - parseInt(b));
  const numLayers = layerKeys.length;

  const layerSpacing = componentSpacing * 2;
  const totalWidth = numLayers * layerSpacing;
  const startX = -totalWidth / 2;

  // Position nodes in each layer
  layerKeys.forEach((layerIndex, i) => {
    const layer = layers[layerIndex];
    const layerHeight = layer.length * componentSpacing;
    const startY = -layerHeight / 2;

    layer.forEach((nodeId, j) => {
      if (components[nodeId]) {
        const node = components[nodeId];
        node.x = startX + i * layerSpacing;
        node.y = startY + j * componentSpacing;

        // Special positioning for input and output ports
        if (node.type === "INPUT_PORT") {
          node.x = startX - componentSpacing;
        } else if (node.type === "OUTPUT_PORT") {
          node.x = startX + totalWidth + componentSpacing;
        }
      }
    });
  });

  return { components, graph };
}

// Calculate layers for components based on connections (for layout purposes)
function calculateLayers(graph) {
  const layers = {};
  const visited = new Set();
  const inputPorts = graph.nodes.filter(node => node.type === "INPUT_PORT").map(node => node.id);
  const outputPorts = graph.nodes.filter(node => node.type === "OUTPUT_PORT").map(node => node.id);

  // Add input ports to layer 0
  layers[0] = inputPorts;
  inputPorts.forEach(id => visited.add(id));

  // Calculate other layers using breadth-first search
  let currentLayer = 0;
  let shouldContinue = true;

  while (shouldContinue) {
    const nextLayer = [];

    if (!layers[currentLayer]) {
      break;
    }

    layers[currentLayer].forEach(nodeId => {
      const outEdges = graph.edges.filter(edge => edge.source === nodeId);

      outEdges.forEach(edge => {
        const targetId = edge.target;

        // Skip output ports - they'll be positioned separately
        if (outputPorts.includes(targetId)) {
          if (!layers[999]) {
            layers[999] = [];
          }
          if (!layers[999].includes(targetId)) {
            layers[999].push(targetId);
          }
          visited.add(targetId);
          return;
        }

        if (!visited.has(targetId)) {
          nextLayer.push(targetId);
          visited.add(targetId);
        }
      });
    });

    if (nextLayer.length > 0) {
      currentLayer++;
      layers[currentLayer] = nextLayer;
    } else {
      shouldContinue = false;
    }
  }

  // Handle nodes that weren't reached
  const unreachedNodes = graph.nodes
    .filter(node => !visited.has(node.id) && !inputPorts.includes(node.id) && !outputPorts.includes(node.id))
    .map(node => node.id);

  if (unreachedNodes.length > 0) {
    const nextLayer = currentLayer + 1;
    layers[nextLayer] = unreachedNodes;
  }

  return layers;
}

// Draw connections between components
function drawConnections(g, components, graph) {
  const connectionGroup = g.append("g")
    .attr("class", "connections");

  graph.edges.forEach(edge => {
    const sourceNode = components[edge.source];
    const targetNode = components[edge.target];

    if (!sourceNode || !targetNode) return;

    // Calculate source and target points
    const source = calculateIOPoint(sourceNode, edge.sourceIO, "output");
    const target = calculateIOPoint(targetNode, edge.targetIO, "input");

    // Draw connection path
    const pathGenerator = d3.line()
      .curve(d3.curveBasis)
      .x(d => d.x)
      .y(d => d.y);

    // Create control points for curved paths
    const controlPointDistance = 30;
    const dx = target.x - source.x;
    const pathPoints = [
      source,
      {
        x: source.x + Math.max(controlPointDistance, dx / 3),
        y: source.y
      },
      {
        x: target.x - Math.max(controlPointDistance, dx / 3),
        y: target.y
      },
      target
    ];

    connectionGroup.append("path")
      .attr("d", pathGenerator(pathPoints))
      .attr("fill", "none")
      .attr("stroke", COLORS.INTERCONNECT)
      .attr("stroke-width", 2)
      .attr("class", "connection-path")
      .attr("id", `path-${edge.id}`)
      .attr("data-delay", edge.delay || 0)
      .attr("data-source", edge.source)
      .attr("data-target", edge.target);

    // Add source IO port indicator
    connectionGroup.append("circle")
      .attr("cx", source.x)
      .attr("cy", source.y)
      .attr("r", SIZES.PORT_RADIUS)
      .attr("fill", COLORS.INPUT_PORT)
      .attr("stroke", COLORS.PORT_STROKE)
      .attr("class", `io-port source-port port-${edge.source}-${edge.sourceIO}`)
      .attr("data-component", edge.source)
      .attr("data-io", edge.sourceIO);

    // Add target IO port indicator
    connectionGroup.append("circle")
      .attr("cx", target.x)
      .attr("cy", target.y)
      .attr("r", SIZES.PORT_RADIUS)
      .attr("fill", COLORS.OUTPUT_PORT)
      .attr("stroke", COLORS.PORT_STROKE)
      .attr("class", `io-port target-port port-${edge.target}-${edge.targetIO}`)
      .attr("data-component", edge.target)
      .attr("data-io", edge.targetIO);
  });
}

// Calculate IO point positions for components
function calculateIOPoint(node, ioName, ioType) {
  if (!node) return { x: 0, y: 0 };

  const isInput = ioType === "input";

  // Identify clock and non-clock IOs
  const isClockIO = ioName.toLowerCase().includes('clock') || ioName.toLowerCase().includes('clk');

  // Separate connections
  const allConnections = node.connections.filter(conn => conn.type === ioType);
  const clockConnections = allConnections.filter(conn =>
    conn.io.toLowerCase().includes('clock') || conn.io.toLowerCase().includes('clk')
  );
  const nonClockConnections = allConnections.filter(conn =>
    !conn.io.toLowerCase().includes('clock') && !conn.io.toLowerCase().includes('clk')
  );

  // Determine the specific index and total count for the current IO
  let ioIndex, totalIOCount;
  if (isClockIO) {
    ioIndex = clockConnections.findIndex(conn => conn.io === ioName);
    totalIOCount = clockConnections.length;
  } else {
    ioIndex = nonClockConnections.findIndex(conn => conn.io === ioName);
    totalIOCount = nonClockConnections.length;
  }

  // Default positions
  let x = node.x;
  let y = node.y;

  // Adjust position based on node type and IO type
  switch (node.type) {
    case "INPUT_PORT":
      x = node.x + SIZES.PORT_RADIUS * 2;
      if (allConnections.length > 1) {
        const verticalSpacing = SIZES.PORT_RADIUS * 4;
        y = 40 + node.y + (ioIndex - (totalIOCount - 1) / 2) * verticalSpacing;
      }
      break;

    case "OUTPUT_PORT":
      x = node.x - SIZES.PORT_RADIUS * 2;
      if (allConnections.length > 1) {
        const verticalSpacing = SIZES.PORT_RADIUS * 4;
        y = node.y + (ioIndex - (totalIOCount - 1) / 2) * verticalSpacing;
      }
      break;

    case "LUT":
      if (isInput) {
        x = node.x - SIZES.LUT_WIDTH / 2;

        // Separate clock and non-clock inputs
        if (isClockIO) {
          // Push clock inputs to the far left
          x -= SIZES.PORT_RADIUS * 2;
        }

        if (totalIOCount > 1) {
          const componentHeight = SIZES.LUT_HEIGHT;
          const step = componentHeight / (totalIOCount + 1);
          y = node.y - componentHeight / 2 + (ioIndex + 1) * step;
        }
      } else {
        x = node.x + SIZES.LUT_WIDTH / 2;
      }
      break;

    case "DFF":
      if (isInput) {
        x = node.x - SIZES.DFF_WIDTH / 2;

        // Separate clock and non-clock inputs
        if (isClockIO) {
          // Push clock inputs further to the left
          y = node.y + 10;
        }

        if (totalIOCount > 1) {
          const componentHeight = SIZES.DFF_HEIGHT;
          const step = componentHeight / (totalIOCount + 1);
          y = node.y - componentHeight / 2 + (ioIndex + 1) * step;
        }
      } else {
        x = node.x + SIZES.DFF_WIDTH / 2;
      }
      break;

    default:
      if (isInput) {
        x = node.x - 20;
        if (totalIOCount > 1) {
          const verticalSpacing = 15;
          y = node.y + (ioIndex - (totalIOCount - 1) / 2) * verticalSpacing;
        }
      } else {
        x = node.x + 20;
        if (totalIOCount > 1) {
          const verticalSpacing = 15;
          y = node.y + (ioIndex - (totalIOCount - 1) / 2) * verticalSpacing;
        }
      }
  }

  return { x, y };
}

// Draw components (LUTs, DFFs, etc.)
function drawComponents(g, components, showLabels) {
  const componentsGroup = g.append("g")
    .attr("class", "components");

  Object.values(components).forEach(node => {
    let shape;

    switch (node.type) {
      case "INPUT_PORT":
        // Draw input port as a circle
        shape = componentsGroup.append("circle")
          .attr("cx", node.x)
          .attr("cy", node.y)
          .attr("r", SIZES.PORT_RADIUS * 2)
          .attr("fill", COLORS.INPUT_PORT)
          .attr("stroke", COLORS.PORT_STROKE)
          .attr("stroke-width", 1.5)
          .attr("class", `component component-${node.id} port-component`);
        break;

      case "OUTPUT_PORT":
        // Draw output port as a circle
        shape = componentsGroup.append("circle")
          .attr("cx", node.x)
          .attr("cy", node.y)
          .attr("r", SIZES.PORT_RADIUS * 2)
          .attr("fill", COLORS.OUTPUT_PORT)
          .attr("stroke", COLORS.PORT_STROKE)
          .attr("stroke-width", 1.5)
          .attr("class", `component component-${node.id} port-component`);
        break;

      case "LUT":
        // Draw LUT as a rectangle
        shape = componentsGroup.append("rect")
          .attr("x", node.x - SIZES.LUT_WIDTH / 2)
          .attr("y", node.y - SIZES.LUT_HEIGHT / 2)
          .attr("width", SIZES.LUT_WIDTH)
          .attr("height", SIZES.LUT_HEIGHT)
          .attr("fill", COLORS.LUT)
          .attr("stroke", COLORS.COMPONENT_STROKE)
          .attr("stroke-width", 1.5)
          .attr("rx", 3)
          .attr("ry", 3)
          .attr("class", `component component-${node.id} lut-component`);
        break;

      case "DFF":
        // Draw DFF as a rectangle with different dimensions
        shape = componentsGroup.append("rect")
          .attr("x", node.x - SIZES.DFF_WIDTH / 2)
          .attr("y", node.y - SIZES.DFF_HEIGHT / 2)
          .attr("width", SIZES.DFF_WIDTH)
          .attr("height", SIZES.DFF_HEIGHT)
          .attr("fill", COLORS.DFF)
          .attr("stroke", COLORS.COMPONENT_STROKE)
          .attr("stroke-width", 1.5)
          .attr("rx", 3)
          .attr("ry", 3)
          .attr("class", `component component-${node.id} dff-component`);
        break;

      default:
        // Draw other components as simple circles
        shape = componentsGroup.append("circle")
          .attr("cx", node.x)
          .attr("cy", node.y)
          .attr("r", 15)
          .attr("fill", "#dfe6e9")
          .attr("stroke", COLORS.COMPONENT_STROKE)
          .attr("stroke-width", 1.5)
          .attr("class", `component component-${node.id} other-component`);
    }

    // Add component label
    let labelX = node.x;
    let labelY = node.y;

    // Adjust label position based on component type
    if (node.type === "LUT" || node.type === "DFF") {
      labelY = node.y + 5;
    } else if (node.type === "INPUT_PORT" || node.type === "OUTPUT_PORT") {
      const labelOffset = 15;
      labelY = node.y - labelOffset;
    }

    componentsGroup.append("text")
      .attr("x", labelX)
      .attr("y", labelY)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", SIZES.FONT_SIZE)
      .attr("fill", COLORS.TEXT)
      .attr("class", `component-label label-${node.id}`)
      .text(getShortName(node.name));

    // Add IO port labels if enabled
    if (showLabels) {
      node.connections.forEach(conn => {
        const ioPoint = calculateIOPoint(node, conn.io, conn.type);

        componentsGroup.append("text")
          .attr("x", ioPoint.x + (conn.type === "input" ? -10 : 10))
          .attr("y", ioPoint.y - 8)
          .attr("text-anchor", conn.type === "input" ? "end" : "start")
          .attr("font-size", SIZES.FONT_SIZE - 2)
          .attr("fill", COLORS.TEXT)
          .attr("class", `io-label label-${node.id}-${conn.io}`)
          .text(getIOName(conn.io));
      });
    }
  });
}

// Helper function to shorten component names for display
function getShortName(name) {
  // Standardize LUT and FF names
  const lutMatch = name.match(/lut_?(\d+)?/i);
  if (lutMatch) {
    return 'LUT';
  }

  const dffMatch = name.match(/(?:dff|latch)_?(\w+)?/i);
  if (dffMatch) {
    return 'DFF';
  }

  // Simplify routing segments
  if (name.startsWith("routing_segment_")) {
    return "Route";
  }

  return name;
}

// Helper function to format IO names
function getIOName(ioName) {
  if (ioName.includes("input_")) {
    return "in" + ioName.replace("input_", "");
  } else if (ioName.includes("output_")) {
    return "out" + ioName.replace("output_", "");
  } else if (ioName.includes("clock_")) {
    return "clk";
  }
  return ioName;
}

// Update active paths based on simulation time
export function updateActivePaths(data, svgRef, simulationTime) {
  if (!data || !svgRef.current) return [];

  const moduleName = Object.keys(data.modules)[0];
  const moduleData = data.modules[moduleName];

  const newActivePaths = [];
  const fixedActivePaths = [];

  // Iterate through interconnect instances
  moduleData.instances
    .filter(instance => instance.type === "fpga_interconnect")
    .forEach(interconnect => {
      interconnect.connections.forEach(conn => {
        const pathId = `path-${conn.fromDevice}_${conn.fromIO}_to_${conn.toDevice}_${conn.toIO}`;
        const isClockPath = conn.fromIO.toLowerCase().includes('clock') ||
          conn.toIO.toLowerCase().includes('clock');

        // Check if the connection is active based on simulation time
        if (simulationTime >= (conn.delay || 0)) {
          if (isClockPath) {
            // Clock paths blink at 100 MHz frequency
            const cycleTime = 10; // nanoseconds
            const isActiveInCycle = Math.floor(simulationTime / cycleTime) % 2 === 0;

            if (isActiveInCycle) {
              newActivePaths.push(pathId);
            }
          } else {
            // Non-clock paths remain fixed once activated
            fixedActivePaths.push(pathId);
          }
        }
      });
    });

  // Update path visualization
  if (svgRef.current) {
    const svg = d3.select(svgRef.current);

    svg.selectAll(".connection-path")
      .attr("stroke", function () {
        const pathId = d3.select(this).attr("id");

        // Clock paths blink
        if (newActivePaths.includes(pathId)) {
          return COLORS.ACTIVE_PATH;
        }

        // Fixed active paths (non-clock) remain active
        if (fixedActivePaths.includes(pathId)) {
          return COLORS.ACTIVE_PATH;
        }

        // Inactive paths
        return COLORS.INTERCONNECT;
      })
      .attr("stroke-width", function () {
        const pathId = d3.select(this).attr("id");

        // Clock paths and fixed active paths have different stroke width
        if (newActivePaths.includes(pathId) || fixedActivePaths.includes(pathId)) {
          return 3;
        }

        return 2; // Default stroke width
      });
  }

  // Combine both types of active paths for return
  return [...newActivePaths, ...fixedActivePaths];
}