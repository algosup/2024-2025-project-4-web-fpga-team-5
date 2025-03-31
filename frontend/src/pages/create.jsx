import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

function Create() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // State for existing examples
  const [projectExamples, setProjectExamples] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/list`);
        if (!response.ok) throw new Error("Erreur lors du fetch");

        const data = await response.json();
        
        // adapt the data to our needs
        const formattedData = data.map((item) => ({
          name: item.name,
          date: item.createdDate,
        }));

        setProjectExamples(formattedData);
      } catch (error) {
        throw new Error("API error :", error);
      }
    };

    fetchData();
  }, []);

  // State for the new example
  const [exampleName, setExampleName] = useState("");
  const [uploadedVerilogFiles, setUploadedVerilogFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);

  // Drag and drop handling
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  // File drop handling
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Click handling for the drop zone
  const handleClick = () => {
    fileInputRef.current.click();
  };

  // File selection handling via button
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // File processing
  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return extension === 'v' || extension === 'sdf';
    });

    if (validFiles.length > 0) {
      setUploadedVerilogFiles([...uploadedVerilogFiles, ...validFiles]);
    } else {
      alert("Please upload only Verilog (.v) or SDF (.sdf) files");
    }
  };

  // Remove a file from the list
  const handleRemoveFile = (index) => {
    const newFiles = [...uploadedVerilogFiles];
    newFiles.splice(index, 1);
    setUploadedVerilogFiles(newFiles);
  };

  // Create a new example
  const handleCreateExample = async () => {
    if (!exampleName.trim()) {
      alert("Please name your example");
      return;
    }

    if (uploadedVerilogFiles.length === 0) {
      alert("Please upload at least one file");
      return;
    }

    // Check if we have both a Verilog file and an SDF file
    const hasVerilog = uploadedVerilogFiles.some(file => file.name.endsWith('.v'));
    const hasSDF = uploadedVerilogFiles.some(file => file.name.endsWith('.sdf'));

    if (!hasVerilog || !hasSDF || uploadedVerilogFiles.length > 2) {
      alert("Please upload both a Verilog (.v) file and an SDF (.sdf) file");
      return;
    }

    // Find the files based on their extensions
    const verilogFile = uploadedVerilogFiles.find(file => file.name.endsWith('.v'));
    const sdfFile = uploadedVerilogFiles.find(file => file.name.endsWith('.sdf'));

    // Create a FormData object to send the files
    const formData = new FormData();
    formData.append('verilogFile', verilogFile);
    formData.append('sdfFile', sdfFile);
    formData.append('projectName', exampleName);

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          body: formData,
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      // Create a new example with the formatted date
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

      // Create a new example
      const newExample = {
        name: exampleName,
        date: formattedDate,
        files: uploadedVerilogFiles
      };
      // Add the new example to the state
      setProjectExamples([...projectExamples, newExample]);

      // Reset the form
      setExampleName("");
      setUploadedVerilogFiles([]);

    } catch (error) {
      throw new Error('Error API:', error);
      alert("Failed to upload files");
    }
  };

  // Delete an existing example
  const handleDeleteExample = async (index) => {
    const fileToDelete = projectExamples[index]; // Get the file to delete
    
  try {
    const response = await fetch(`${API_URL}/api/delete-project/${fileToDelete.name}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erreur lors de la suppression");

    // update the state
    const newFiles = [...projectExamples];
    newFiles.splice(index, 1);
    setProjectExamples(newFiles);
    
  } catch (error) {
    throw new Error("Erreur lors de la suppression :", error);
  }
};

  return (
    <div className="w-screen h-screen bg-gray-100 flex flex-col">
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
      <main className="flex flex-col items-center flex-grow w-full overflow-y-auto">
        {/* Create Section */}
        <section className="w-full max-w-4xl px-4 md:px-6 py-8">
          <h2 className="text-xl md:text-2xl text-[#14002b] font-semibold text-center mb-6">
            Welcome to the Creation Interface
          </h2>

          <div className="bg-[#14002b] p-6 md:p-8 rounded-xl shadow-2xl mb-10">
            <h3 className="text-xl font-semibold text-white mb-4">Add Example</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Drag & drop zone */}
              <div
                className={`md:col-span-1 md:row-span-2 h-40 md:h-48 w-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                  isDragActive ? "bg-purple-100 border-purple-500" : "bg-white border-gray-300"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleChange}
                  accept=".v,.sdf"
                  className="hidden"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#14002b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-[#14002b] text-center mt-2">
                  Drag & drop your Verilog (.v) and SDF (.sdf) files here<br />
                  <span className="text-sm">or click to select files</span>
                </p>
              </div>

              {/* Input Name */}
              <input
                type="text"
                placeholder="Name your example"
                value={exampleName}
                onChange={(e) => setExampleName(e.target.value)}
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* Uploaded Files */}
              <div className="bg-white h-full p-4 rounded-lg text-[#14002b] flex flex-col overflow-y-auto max-h-48">
                {uploadedVerilogFiles.length > 0 ? (
                  uploadedVerilogFiles.map((file, index) => (
                    <div key={index} className="flex justify-between items-center mb-2">
                      <span className={file.name.endsWith('.v') ? "text-blue-600" : "text-green-600"}>
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No files uploaded yet</p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleCreateExample}
                className="px-6 py-3 bg-white text-[#14002b] rounded-lg font-bold shadow-lg hover:bg-gray-200 transition-all duration-300 ease-in-out
                        hover:shadow-2xl hover:scale-105 text-lg"
              >
                Create
              </button>
            </div>
          </div>
        </section>

        {/* Existing Examples */}
        <section className="w-full max-w-4xl px-4 md:px-6 pb-8">
          <h2 className="text-xl md:text-2xl text-[#14002b] font-semibold text-center mb-6">
            Examples Already Created
          </h2>

          <div className="bg-white p-6 rounded-xl shadow-xl mb-8">
            {projectExamples.length > 0 ? (
              <table className="w-full border-collapse text-[#14002b]">
                <thead>
                  <tr className="bg-[#14002b] text-white">
                    <th className="p-3 rounded-tl-lg">Name</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 rounded-tr-lg">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {projectExamples.map((ex, index) => (
                    <tr
                      key={index}
                      className={`border-b border-[#14002b] ${index === projectExamples.length - 1 ? 'border-none' : ''}`}
                    >
                      <td className="p-3 text-center">{ex.name}</td>
                      <td className="p-3 text-center">{ex.date}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleDeleteExample(index)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500 p-4">No examples created yet</p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => navigate("/visualize")}
              className="px-6 py-4 bg-[#14002b] text-white rounded-lg font-bold shadow-lg hover:bg-purple-900 transition-all duration-300 ease-in-out
                        hover:shadow-2xl hover:scale-105 text-lg w-full md:w-1/2 lg:w-1/3"
            >
              Go to Visualization
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 bg-[#14002b] text-white text-center text-sm mt-auto">
        <p>© 2025 SPIN - FPGA Educational Simulator</p>
      </footer>
    </div>
  );
}

export default Create;