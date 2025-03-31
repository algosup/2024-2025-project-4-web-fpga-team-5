import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center">
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
      <main className="flex flex-col items-center justify-center flex-grow w-full max-w-4xl px-4 md:px-0">
        <h2 className="text-xl md:text-2xl text-[#14002b] font-semibold text-center mb-6 mt-10 md:mt-6">
          Welcome to the FPGA Educational Simulator
        </h2>

        
        {/* Project Description */}
        <div className="mb-10 text-center max-w-2xl">
          <p className="text-gray-700 leading-relaxed">
            SPIN is an interactive FPGA visualization tool designed to help students and engineers understand signal propagation within field-programmable gate arrays. Explore real-time signal flows, create custom designs, and learn the fundamentals of digital circuit design in an intuitive environment.
          </p>
        </div>
        
        <div className="mt-4 mb-10 md:mb-10 flex flex-col items-center gap-8 bg-[#14002b] p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-xl">
          <p className="text-2xl md:text-3xl text-white font-semibold">Get Started</p>
          
          <div className="flex flex-col sm:flex-row gap-8 w-full justify-center items-center">
            <button
              onClick={() => navigate("/visualize")}
              className="w-full sm:w-48 px-6 py-4 bg-white text-[#14002b] rounded-lg font-bold shadow-lg 
                        hover:bg-gray-200 transition-all duration-300 ease-in-out 
                        hover:shadow-2xl hover:scale-105 text-lg"
            >
              Visualize
            </button>
            <button
              onClick={() => navigate("/create")}
              className="w-full sm:w-48 px-6 py-4 bg-white text-[#14002b] rounded-lg font-bold shadow-lg 
                        hover:bg-gray-200 transition-all duration-300 ease-in-out 
                        hover:shadow-2xl hover:scale-105 text-lg"
            >
              Create
            </button>
          </div>
          <div className="mt-6 text-white text-center">
            <p className="text-sm md:text-base opacity-80">Visualize existing FPGA designs or create your own from scratch</p>
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

export default Home;