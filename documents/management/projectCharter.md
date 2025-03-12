
<div align="center">

---

# 2024 - 2025 Project-2 Serious Game Team-8 - Project Charter


| Description    | Information   |
| -------------- | ------------- |
| Document Owner | Robin Goumy   |
| Creation Date  | 27/02/2025    |
| Last Update    | 12/03/2025    |

</div>

<br>

<details>

<summary>Table of Contents</summary>

- [2024 - 2025 Project-2 Serious Game Team-8 - Project Charter](#2024---2025-project-2-serious-game-team-8---project-charter)
  - [Team member](#team-member)
  - [Scope](#scope)
    - [Project Purpose](#project-purpose)
    - [Core Requirements](#core-requirements)
      - [Technologies and Accessibility](#technologies-and-accessibility)
      - [Student Interface](#student-interface)
      - [Teacher Interface](#teacher-interface)
      - [Expected Deliverables](#expected-deliverables)
  - [Out of Scope](#out-of-scope)
  - [Project Limitations](#project-limitations)
    - [Constraints](#constraints)
    - [Risks](#risks)
  - [Stakeholders](#stakeholders)
  - [Communication](#communication)
  - [Responsibilities](#responsibilities)
  - [Deadline](#deadline)
  - [Allocated Resources](#allocated-resources)
</details>

## Team member
| Picture                                                                                    | Name              | Role                |
| ------------------------------------------------------------------------------------------ | ----------------- | ------------------- |
| <img src="https://avatars.githubusercontent.com/u/182214449?v=4" width="100" height="100"> | Robin GOUMY       | Project Manager     |
| <img src="https://avatars.githubusercontent.com/u/123485791?v=4" width="100" height="100"> | Alexandre BOPP    | Program Manager     |
| <img src="https://avatars.githubusercontent.com/u/145995586?v=4" width="100" height="100"> | Maxime THIZEAU    | Technical Leader    |
| <img src="https://avatars.githubusercontent.com/u/62845771?v=4" width="100" height="100">  | Geoffrey Delrieu | Software Engineer 1 |
| <img src="https://avatars.githubusercontent.com/u/145995367?v=4" width="100" height="100"> | Mathias DELILLE   | Quality Assurance   |
| <img src="https://avatars.githubusercontent.com/u/145991425?v=4" width="100" height="100"> | Habi CAILLEAU     | Technical Writer    |



## Scope

### Project Purpose

This project aims to create a web interface, visually combining 2D FPGA layouts with real-time signal propagation. It will help students understand FPGA behavior through interactive interface while allowing teachers to upload educational examples.

[Here](https://github.com/LeFl0w/ALGOSUP_POC/tree/main) you can find the Call of tender, of this project.

### Core Requirements

#### Technologies and Accessibility

- Developed using an open-source web technology.
- Accessible via a web browser.
- Data hosted on a backend server.

#### Student Interface

- 2D visualization of BELs and signal connections.
- Navigation (zoom, move).
- Selection of preloaded application examples.
- Simulation playback at different speeds (x1, x2, x4…).
- Pause/resume and step-by-step execution buttons.

#### Teacher Interface

- Uploading of Verilog application files and testbenches.
- Generation of simulation and visualization files.
- Definition of an intermediate pivot file format for easier data integration.

#### Expected Deliverables

- Source code on a Git repository.
- Documentation on installation and usage.
- Two educational examples: a flip-flop and a LUT4.

## Out of Scope

- Have multiple educational example (more than 2).
- Create a 3D visualisation of the signal.
- Support for several FPGA families


## Project Limitations

### Constraints

- Input files must be in Verilog and SDF formats.
- Need for smooth and interactive graphical visualization.
- Backend must efficiently transform input data for frontend usage.

### Risks

- Complex data transformation: Converting Verilog and SDF files into a usable frontend format could be challenging.
- Performance and interactivity: Ensuring real-time, smooth animation.
- Tool interoperability: Potential incompatibilities between input formats and open-source tools could slow down development.


## Stakeholders

| Role   | Representative              | 
| ------ | --------------------------- | 
| Client | Florent Manni (CNES)        |

## Communication

Communication with the customer has been set up in Slack as well as GitHub for [issues](https://github.com/LeFl0w/ALGOSUP_POC/issues).

## Responsibilities

| Team Member       | Position             | Key Responsibilities                                                                 | Success Criteria                                                                        |
| ----------------- | -------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Robin GOUMY       | Project Manager      | Oversee project schedule and resource allocation<br>Assign tasks among team members<br>Provide progress updates to stakeholders<br>Identify and mitigate potential risks | Timely project completion<br>Fully functional software<br>Optimal resource utilization<br>Smooth workflow |
| Alexandre BOPP    | Program Manager      | Design mockups and general layout<br>Act as liaison with the client<br>Define functional requirements<br>Assess and manage project risks | Well-defined functional specifications<br>Positive client reception regarding design and usability |
| Maxime THIZEAU    | Technical Lead       | Establish coding guidelines<br>Select appropriate technologies<br>Draft technical documentation<br>Supervise development work | Detailed and comprehensive technical documentation |
| Geoffrey DELRIEU  | Software Developer   | Implement core features<br>Resolve software issues<br>Maintain and document the codebase<br>Develop and execute unit tests | Successful feature implementation<br>Minimal bug occurrence |
| Mathias DELILLE | Quality Assurance    | Review and validate documentation<br>Conduct software testing<br>Ensure compliance with client requirements<br>Develop a structured testing plan | Well-defined and executed test plan<br>Effective bug detection<br>Comprehensive documentation |
| Habi CAILLEAU     | Technical Writer     | Write and structure the user guide                                                   | Clear, well-organized, and accessible documentation |


## Deadline

| Date       | Milestone                |
| ---------- | ------------------------ |
| 13/03/2025 | Functional Specification |
| 25/03/2025 | Technical Specification  |
| 24/03/2025 | V.1 Code                 |
| 25/03/2025 | Test Plan                |
| 25/03/2025 | Test Case                |
| 01/04/2025 | User Manual              |

## Allocated Resources

- **Budget:** €0
- **Team:** 6 members
- **Work Hours:** 20 half-days of 3 hours and 30 minutes each = 70h

**Total estimated human hours:** 70h * 6 = 420H

---
