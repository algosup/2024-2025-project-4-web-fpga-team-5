import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { setupVisualization, updateActivePaths } from "./visualizationEngine";
import API_URL from "../config";

function Visualize() {
  const navigate = useNavigate();
  const [selectedExample, setSelectedExample] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(0.1);
  const [data, setData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeSignalPaths, setActiveSignalPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLabelsVisible, setIsLabelsVisible] = useState(false);
  const [isFullPage, setIsFullPage] = useState(false);

  
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const animationRef = useRef(null);
  const simulationTimeRef = useRef(0);
  const zoomBehaviorRef = useRef(null);

  const [projectExamples, setProjectExamples] = useState([]);

  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/list`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Map the data to the desired format
        const updatedExamples = data.map(item => ({
          name: item.name,
          path: `${API_URL}/api/map/${item.name}`
        }));

        console.log("Fetched examples:", updatedExamples);
        
        // Update the state with the fetched data
        setProjectExamples(updatedExamples);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the function to fetch data
    fetchData();
  }, []);

  // Load data when example changes
  useEffect(() => {
    if (!selectedExample) {
      setData(null);
      return;
    }

    setIsLoading(true);
    const selectedPath = projectExamples.find(ex => ex.name === selectedExample)?.path;
    
    // In a real implementation, this would fetch from the server
    fetch(selectedPath)
      .then(response => response.json())
      .then(jsonData => {
        setData(jsonData);
        setCurrentStep(0);
        setActiveSignalPaths([]);
        setupVisualization(jsonData, containerRef, svgRef, zoomLevel, isLabelsVisible);
        
        // Store reference to the zoom behavior if it's created during setup
        if (svgRef.current && svgRef.current.__zoom) {
          zoomBehaviorRef.current = svgRef.current.__zoom;
        }
        
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error loading data:", error);
        setIsLoading(false);
      });
  }, [selectedExample]);

  // Update when zoom level or label visibility changes
  useEffect(() => {
    if (data) {
      setupVisualization(data, containerRef, svgRef, zoomLevel, isLabelsVisible);
      
      // Update zoom behavior reference
      if (svgRef.current && svgRef.current.__zoom) {
        zoomBehaviorRef.current = svgRef.current.__zoom;
      }
    }
  }, [zoomLevel, isLabelsVisible]);

  // Animation functions
  useEffect(() => {
    if (isPlaying && data) {
      // Start animation
      let lastTimestamp = 0;
      const animate = (timestamp) => {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const deltaTime = timestamp - lastTimestamp;
        
        // Update simulation time based on speed
        simulationTimeRef.current += deltaTime * speed;
        
        // Determine which paths should be active based on simulation time
        const newActivePaths = updateActivePaths(data, svgRef, simulationTimeRef.current);
        setActiveSignalPaths(newActivePaths || []);
        
        lastTimestamp = timestamp;
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying, data, speed]);

  // Handle step button click - scaled by speed value
  const handleNextStep = () => {
    if (!data) return;
    
    // Calculate step size based on current speed setting
    // For 0.001, make 1 step unit
    // For 0.01, make 10 step units
    // For 0.1, make 100 step units
    // For 1, make 1000 step units
    let stepSize = 1;
    if (speed === 0.001) stepSize = 1;
    else if (speed === 0.01) stepSize = 10;
    else if (speed === 0.1) stepSize = 100;
    else if (speed === 1) stepSize = 1000;
    
    // Increment simulation time by the calculated step size
    simulationTimeRef.current += stepSize;
    const newActivePaths = updateActivePaths(data, svgRef, simulationTimeRef.current);
    setActiveSignalPaths(newActivePaths || []);
  };


  const handleNextBack = () => {
    if (!data) return;
    
    // Calculate step size based on current speed setting
    // For 0.001, make 1 step unit
    // For 0.01, make 10 step units
    // For 0.1, make 100 step units
    // For 1, make 1000 step units
    let stepSize = -1;
    if (speed === 0.001) stepSize = -1;
    else if (speed === 0.01) stepSize = -10;
    else if (speed === 0.1) stepSize = -100;
    else if (speed === 1) stepSize = -1000;
    
    // Increment simulation time by the calculated step size
    simulationTimeRef.current += stepSize;
    const newActivePaths = updateActivePaths(data, svgRef, simulationTimeRef.current);
    setActiveSignalPaths(newActivePaths || []);
  };

  // Handle reset view - complete reset of both pan and zoom
  const handleResetView = () => {
    // Reset zoom level to default
    setZoomLevel(0.4);
    
    // Reset position to center
    setPosition({ x: 0, y: 0 });
    
    // If SVG is set up, attempt to reset visualization
    if (containerRef.current && svgRef.current) {
      try {
        // Rerun setup visualization with default zoom
        setupVisualization(
          data, 
          containerRef, 
          svgRef, 
          1,  // Reset zoom level to 1
          isLabelsVisible
        );
      } catch (e) {
        console.error("Error resetting view:", e);
      }
    }
  };

  // Toggle IO labels visibility
  const handleToggleLabels = () => {
    setIsLabelsVisible(prev => !prev);
  };

  // Handle play/pause controls
  const handleTogglePlayback = () => {
    setIsPlaying(prev => !prev);
  };

  // Reset simulation
  const handleResetSimulation = () => {
    simulationTimeRef.current = 0;
    setActiveSignalPaths([]);
    const newActivePaths = updateActivePaths(data, svgRef, simulationTimeRef.current);
    setActiveSignalPaths(newActivePaths || []);
  };

  const handleToggleFullPage = () => {
    setIsFullPage(prev => !prev);
  };

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col">
      {/* Header Section */}
      <header className="bg-[#14002b] w-full flex flex-col items-center p-4 md:p-6 border-b-2 border-white shadow-lg">
        <div 
          className="flex flex-row justify-center gap-4 md:gap-6 items-center cursor-pointer transition-transform duration-300 hover:scale-105" 
          onClick={() => navigate("/")}
        >
          <img
            src="./images/logo.png"
            alt="SPIN Logo"
            className="w-10 h-10 md:w-12 md:h-12 cursor-pointer"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-white">SPIN</h1>
        </div>
        <p className="text-md md:text-lg text-white mt-2">Signal Propagation Inspector</p>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full flex flex-col items-center py-6">
        <h2 className="text-xl md:text-2xl text-[#14002b] font-semibold text-center mb-6">
          Welcome To The Visualization
        </h2>

        {/* Dropdown Selection */}
        <div className="w-full max-w-xl mb-8">
          <select
            value={selectedExample}
            onChange={(e) => setSelectedExample(e.target.value)}
            className="w-full p-3 md:p-4 border rounded-lg bg-[#14002b] text-white text-lg focus:outline-none"
          >
            <option hidden>Select an example</option>
            {projectExamples.map(example => (
              <option key={example.name} value={example.name}>{example.name}</option>
            ))}
          </select>
        </div>

        {/* Visualization Section */}
        <div className={`bg-[#14002b] p-6 md:p-8 rounded-xl shadow-2xl mb-6 ${isFullPage ? 'full-page' : 'w-full max-w-4xl'}`}>
          <h3 className="text-xl md:text-2xl font-semibold mb-4 text-white text-center">
            Propagation Signals Interface
          </h3>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center mb-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-[#6ab04c] mr-2"></div>
              <span className="text-white text-sm">Input Ports</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-[#eb4d4b] mr-2"></div>
              <span className="text-white text-sm">Output Ports</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-[#f0932b] mr-2"></div>
              <span className="text-white text-sm">LUTs</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-[#686de0] mr-2"></div>
              <span className="text-white text-sm">DFFs</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-r from-[#0984e3] to-[#2ecc71] mr-2 rounded"></div>
              <span className="text-white text-sm">Active Signals</span>
            </div>
          </div>
          
          {/* D3.js Visualization Container */}
          <div 
            ref={containerRef}
            id="d3-container" 
            className={`w-full h-96 bg-white rounded-lg mb-6 flex items-center justify-center relative overflow-hidden ${isFullPage ? 'full-page-container' : ''}`}
          >
            {!selectedExample ? (
              <p className="text-[#14002b] text-lg">Select an example to visualize</p>
            ) : isLoading ? (
              <p className="text-[#14002b] text-lg">Loading visualization for {selectedExample}...</p>
            ) : null}
          </div>
          
          {/* Simulation Info */}
          <div className="text-white mb-4 text-center">
            <p>Simulation Time: {Math.floor(simulationTimeRef.current)} picoseconds</p>
            <p>Active Paths: {activeSignalPaths.length}</p>
          </div>
          
          {/* Playback Controls */}
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <button 
              onClick={handleTogglePlayback}
              disabled={!selectedExample}
              className={`px-6 py-3 ${!selectedExample ? 'bg-gray-400' : 'bg-white hover:bg-gray-200'} text-[#14002b] rounded-lg font-bold shadow-lg transition-all duration-300 ease-in-out 
                      hover:shadow-2xl hover:scale-105 text-lg`}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button 
              onClick={handleNextStep}
              disabled={!selectedExample || isPlaying}
              className={`px-6 py-3 ${!selectedExample || isPlaying ? 'bg-gray-400' : 'bg-white hover:bg-gray-200'} text-[#14002b] rounded-lg font-bold shadow-lg transition-all duration-300 ease-in-out 
                      hover:shadow-2xl hover:scale-105 text-lg`}
            >
              Step {speed === 0.001 ? '(+1)' : speed === 0.01 ? '(+10)' : speed === 0.1 ? '(+100)' : '(+1000)'}
            </button>
            <button 
              onClick={handleNextBack}
              disabled={!selectedExample || isPlaying}
              className={`px-6 py-3 ${!selectedExample || isPlaying ? 'bg-gray-400' : 'bg-white hover:bg-gray-200'} text-[#14002b] rounded-lg font-bold shadow-lg transition-all duration-300 ease-in-out 
                      hover:shadow-2xl hover:scale-105 text-lg`}
            >
              Back {speed === 0.001 ? '(-1)' : speed === 0.01 ? '(-10)' : speed === 0.1 ? '(-100)' : '(-1000)'}
            </button>
            <button 
              onClick={handleResetSimulation}
              disabled={!selectedExample}
              className={`px-6 py-3 ${!selectedExample ? 'bg-gray-400' : 'bg-white hover:bg-gray-200'} text-[#14002b] rounded-lg font-bold shadow-lg transition-all duration-300 ease-in-out 
                      hover:shadow-2xl hover:scale-105 text-lg`}
            >
              Reset
            </button>
            
            {/* Speed Control with ultra-slow options */}
            <div className="flex items-center">
              <span className="text-white mr-2">Speed:</span>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                disabled={!selectedExample}
                className={`px-4 py-3 ${!selectedExample ? 'bg-gray-400' : 'bg-white'} text-[#14002b] rounded-lg font-bold`}
              >
                <option value={0.001}>x0.001</option>
                <option value={0.01}>x0.01</option>
                <option value={0.1}>x0.1</option>
                <option value={1}>x1</option>
              </select>
            </div>
          </div>
          
          {/* Navigation Controls - kept reset view and labels */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={handleResetView}
              disabled={!selectedExample}
              className={`px-6 py-3 ${!selectedExample ? 'bg-gray-400' : 'bg-white hover:bg-gray-200'} text-[#14002b] rounded-lg font-bold shadow-lg transition-all duration-300 ease-in-out 
                      hover:shadow-2xl hover:scale-105 text-lg`}
            >
              Reset View
            </button>
            <button 
              onClick={handleToggleLabels}
              disabled={!selectedExample}
              className={`px-6 py-3 ${!selectedExample ? 'bg-gray-400' : isLabelsVisible ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-white hover:bg-gray-200'} text-[#14002b] rounded-lg font-bold shadow-lg transition-all duration-300 ease-in-out 
                      hover:shadow-2xl hover:scale-105 text-lg`}
            >
              {isLabelsVisible ? 'Hide I/O Labels' : 'Show I/O Labels'}
            </button>

            <button 
              onClick={handleToggleFullPage}
              className={`px-6 py-3 bg-white hover:bg-gray-200 text-[#14002b] rounded-lg font-bold shadow-lg transition-all duration-300 ease-in-out 
                      hover:shadow-2xl hover:scale-105 text-lg`}
            >
              {isFullPage ? 'Exit Full Page' : 'Full Page'}
            </button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-4 bg-[#14002b] text-white text-center text-sm">
        <p>© 2025 SPIN - FPGA Educational Simulator</p>
      </footer>
    </div>
  );
}

export default Visualize;