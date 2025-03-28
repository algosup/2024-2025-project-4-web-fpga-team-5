# User Manual - Team 5

- [User Manual - Team 5](#user-manual---team-5)
  - [Introduction](#introduction)
    - [Purpose Of The Manual And Application (find a right header name)](#purpose-of-the-manual-and-application-find-a-right-header-name)
    - [Scope](#scope)
  - [Getting Started](#getting-started)
    - [System Requirements](#system-requirements)
    - [Installation Guide](#installation-guide)
    - [Accessing the Application](#accessing-the-application)
  - [Overview of the FPGA Simulator](#overview-of-the-fpga-simulator)
    - [Key Features and Functionalities](#key-features-and-functionalities)
    - [User Roles: Visualize vs Create](#user-roles-visualize-vs-create)
  - [User Interface Overview](#user-interface-overview)
    - [Main Dashboard](#main-dashboard)
    - [Navigation Tips](#navigation-tips)
  - [Visualize Preloaded FPGA Simulations](#visualize-preloaded-fpga-simulations)
    - [Selecting Preloaded Examples](#selecting-preloaded-examples)
    - [2D Floorplan View (to fill after)](#2d-floorplan-view-to-fill-after)
    - [Simulation Controls](#simulation-controls)
    - [Interactive Features](#interactive-features)
  - [Create Simulation](#create-simulation)
    - [Uploading New Applications](#uploading-new-applications)
    - [Generating the right File Format](#generating-the-right-file-format)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
    - [FAQs](#faqs)

## Introduction 

### Purpose Of The Manual And Application (find a right header name)
This manual provides comprehensive guidance for using SPIN (Signal Propagation Inspector), our web-based FPGA simulation tool. SPIN is designed to simulate and visually display signal propagation within an FPGA board, making it easier for users to understand the inner workings of FPGA architectures. This document covers everything you need to launch the project, access the web interface, navigate its features, and initiate simulations effectively.
 
### Scope 

SPIN offers an intuitive visualization of real-time signal behavior on an FPGA board, serving as an educational tool for individuals who may not be familiar with FPGA technology. The primary objectives of SPIN are to:
- **Educate:** Introduce and clarify how signals propagate through an FPGA board.
- **Demonstrate:** Provide hands-on examples of FPGA functionality through simulation.
- **Empower:** Allow users to run pre-configured software examples as well as import their own files for custom simulations.




## Getting Started 

### System Requirements
In pdf
### Installation Guide
In pdf
### Accessing the Application
In pdf




## Overview of the FPGA Simulator

### Key Features and Functionalities
- **2D Floorplan Visualization:** Displays the internal structure of the FPGA, showing its basic elements (BELs) and the routes between them.  
- **Real-Time Signal Propagation:** Signals appear as animated lines to illustrate the time it takes for them to travel between components—longer routes take more time to activate, highlighting propagation delays.  
- **Interactive Simulation Controls:** Play, pause, and step through the simulation, or adjust the speed (x1, x2, x4, etc.) to observe signal behavior in slow or accelerated motion.  
- **Zoom and Pan:** Easily navigate and zoom in on specific FPGA areas to examine the finer details of signal paths.  
- **Example Management:** Users can load existing examples or create new ones, offering both preloaded (visualize) and custom (create) scenarios.


### User Roles: Visualize vs Create
- **Visualize:** Select from preloaded examples to explore how signals propagate in different FPGA setups.  
- **Create:** Upload your own Verilog and testbench files to generate new examples. Once created, these examples appear in the list alongside any preloaded ones.

This dual-mode approach allows all users—whether learners or advanced designers—to either explore existing examples or craft custom simulations based on their own designs.



## User Interface Overview

### Main Dashboard
Upon launching the application, you will see two primary sections:

1. **Visualize**  
   - **Example Selection:** Choose from a list of existing preloaded examples.  
   - **Simulation Controls:** Use the play, pause, step, and speed-adjustment buttons to view how signals propagate across the FPGA.  
   - **Zoom & Pan:** Focus on specific regions of the FPGA floorplan to observe timing and routing details.  

2. **Create**  
   - **File Upload:** Select a Verilog file and a corresponding testbench file.  
   - **Naming Your Example:** Assign a name to your newly created example for easy identification.  
   - **Example Management:** Once created, your custom example appears in a table where you can edit or delete it.  
   - **Go to Visualization:** Switch to the visualization interface, where you can see your newly created example along with any preloaded ones.

The dashboard layout is designed for easy switching between these two modes—just pick the one that suits your immediate needs.

### Navigation Tips
- **Choosing Your Mode:** On the main dashboard, click **Visualize** to explore preloaded or previously created examples, or click **Create** to add a new example.  
- **Moving Around the FPGA View:** Once in the visualization screen, use your mouse or touch gestures to zoom and pan across the FPGA. This helps in closely examining signal paths and delays.  
- **Switching Examples:** At any time, you can return to the main dashboard to select a different example or create another one.  

By following these steps, you’ll be able to seamlessly transition between exploring existing FPGA simulations and crafting your own, all within a single, unified interface.




## Visualize Preloaded FPGA Simulations 

### Selecting Preloaded Examples 

The Visualize section allows you to explore preloaded FPGA simulations with a 2D floorplan and signal propagation.

To select an example:

1. Open the dropdown menu at the bottom of the page.
2. Choose from the available examples (e.g., "1ff_VTR," "2ffs_VTR," etc.).
3. If you have created your own simulations, they will also appear in this menu for easy access.


In the visualize part, you can choose to load the 2D floorplan and simulation controls with the preloaded examples(e.g., “1ff_VTR,” “2ffs_VTR,” etc.). These examples are available in a dropdown menu located at the bottom of the page. Furthermore, in this menu you will also have access to the simulation you have created beforehand. Below is a representation of the drop-down menu : 


### 2D Floorplan View (to fill after)
> **Note:** This section will be updated once the final design and visual representation of the FPGA are confirmed.  
> - **Planned Content:** Explanation of how to read the floorplan, identify BELs, and trace signal routes.


### Simulation Controls
After selecting an example, you'll have access to a panel of tools within the simulation interface, below is a description of the main buttons :

- **Play** : Starts the simulation for the selected preloaded example, initiating the real time display of signal propagation.  
  > Representation
- **Pause/Resume** : Temporarily stop the simulation and then resume it from the same point.
  > Representation
- **Step** : One click advances the simulation one increment at a time, enabling you to observe the transition of each electrical signal (represented by a line). You can also move back to review previous steps.
  > Representation
- **Speed** : click on it to adjusts the simulation speed to 1x, 2x, or 3x. 
  > Representation


### Interactive Features
The simulation interface is navigable, the following features can be used to drive inside it : 

- **Zoom:** Click on the magnifying glass icons to adjust the zoom level, allowing you to focus on specific areas or view the entire FPGA layout.
- **Pan** : Click and drag within the simulation area to move across different regions of the FPGA.





## Create Simulation

### Uploading New Applications
If you want to create your own simulation, the "Create" section allows you to upload and manage custom examples.

To upload a new example :

1. Select "Create" on the homepage.
2. Provide the testbench and Verilog application files.
3. Enter a name for your example. 
4. Click "create" to upload your simulation.

📌 Tip : A table is available at the end of the page to manage all the simulations generated, including deleting them. 


### Generating the right File Format
Before creating a new simulation, ensure that your files meet the following requirements:

- Verilog application : Must be a netlist schematic in a Verilog (.v) format.
- Testbench : Must be a Standard Delay (SDF) file with a .sdf format.


## Troubleshooting

### Common Issues
- **Simulation Not Starting:**  
  - **Potential Causes:** Missing or incorrectly formatted input files (Verilog netlist or SDF delay file), or incompatible FPGA model.  
  - **Solutions:**  
    - Verify that your files follow the correct format and naming conventions.  
    - Ensure the files are compatible with the selected FPGA model (e.g., NanoXplore NGultra or Xilinx Series 7).

- **Display Errors:**  
  - **Potential Causes:** Incorrect file content or missing graphical elements.  
  - **Solutions:**  
    - Check the netlist schematic to ensure all BELs are correctly represented.  
    - Confirm that the SDF file accurately reflects timing delays.

- **Control Buttons Not Responding:**  
  - **Potential Causes:** Browser compatibility issues or incomplete file uploads.  
  - **Solutions:**  
    - Try refreshing the page or using a different browser.  
    - Ensure that the simulation example is fully loaded before interacting with controls.

### FAQs
- **Q:** What should I do if my simulation doesn’t start?  
  **A:** Verify that your Verilog and SDF files adhere to the required formats, and check the compatibility with the FPGA model.

- **Q:** How can I adjust the simulation speed?  
  **A:** Use the Speed control options (e.g., 1x, 2x, or 3x) provided in the simulation interface.

- **Q:** Can I edit my created examples?  
  **A:** Yes, examples you create can be managed (edited or deleted) via the table at the bottom of the page.

- **Q:** What browsers are supported?  
  **A:** The application works best on modern browsers like Chrome, Firefox, or Edge. For the best experience, ensure your browser is up-to-date.