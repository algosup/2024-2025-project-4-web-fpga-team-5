<img alt="CNES Logo" src="./images/cnes.png"  width="160" height="60" align="right">

# Web FPGA - Team 5

This repository held a visualization of a FPGA simulation.

---

## Definition

This project involves creating a web-based interface for an FPGA simulator that visually demonstrates how signals propagate within an FPGA. It is designed to serve as an educational tool. Our goal is to help users understand FPGA internals by merging a 2D floorplan view of the FPGA (showing its basic elements and the interconnections between them) with a dynamic simulation of signal timing.

---

## Table Of Contents

- [Web FPGA - Team 5](#web-fpga---team-5)
  - [Definition](#definition)
  - [Table Of Contents](#table-of-contents)
  - [Status](#status)
  - [Roadmap](#roadmap)
  - [Installing/Getting Started](#installinggetting-started)
    - [User Installation Procedure](#user-installation-procedure)
    - [Developers Installation Procedure](#developers-installation-procedure)
  - [Documentation Of The Project](#documentation-of-the-project)
  - [Developing](#developing)
    - [Built With](#built-with)
    - [Prerequisites](#prerequisites)
  - [Tests](#tests)
  - [Contributing](#contributing)
  - [API Description](#api-description)
  - [Changelog](#changelog)
  - [Copyrights](#copyrights)
  - [License](#license)
  - [Contacts](#contacts)
  - [Credits And Acknowledgement](#credits-and-acknowledgement)

---

## Status

This project is still in progress and would be done after the 2025/04/01. After this date, consider the project as ended, or as archived.

---

## Roadmap

This project is a six-week school project. Therefore, the roadmap would only be effective for this among if time. \
If you want to give it an eye, you can access the roadmap by clicking [this link](https://sharing.clickup.com/9015908151/g/h/8cp7ntq-1135/93cbe38f66cc00e).

---

## Installing/Getting Started

### User Installation Procedure

1. Clone the repository.

```bash
git clone https://github.com/algosup/2024-2025-project-4-web-fpga-team-5
```

2. Navigate to the directory.

```bash
cd 2024-2025-project-4-web-fpga-team-5/backend
```

3. Install dependencies.

```bash
npm i
```

4. Start the server.

```bash
node index.js
```

---

The application is now available at the following address:
>http://localhost:3000 

Or:

>http://[adresseIP]:3000

---

### Developers Installation Procedure

1. Clone the repository (branch dev).

```bash
git clone https://github.com/algosup/2024-2025-project-4-web-fpga-team-5
```

2. Navigate to the backend directory.

```bash
cd 2024-2025-project-4-web-fpga-team-5/backend
```

3. Install dependencies.

```bash
npm i
```

4. Navigate to the frontend directory.

```bash
cd ../frontend
```

5. Install dependencies.

```bash
npm i
```

6. Go back to main directory.

```bash
cd ..
```

7. Start the backend server (first terminal).

```bash
node 2024-2025-project-4-web-fpga-team-5/backend/index.js
```

8. Start the Vite server (second terminal).

```bash
cd 2024-2025-project-4-web-fpga-team-5/frontend
npm run dev
```

---

The application is now available at the following address:
>http://localhost:3001

---

For better information, please, refer to the [User Manual](documents/manual/userManual.md).

---

## Documentation Of The Project

- This document describes what the software should do by outlining user requirements and expected functionalities :
  - **[Functional Specifications](documents/functional/functionalSpecifications.md)**

- This document details how the software will be built, including architecture, design, and technology choices.
  - **[Technical Specifications](documents/technical/technicalSpecifications.md)**
  
- This document officially initiates the project by defining its scope, objectives, stakeholders, and overall framework.
  - **[Project Charter](documents/management/projectCharter.md)**
  
- This document outlines the strategy, procedures, and criteria for verifying that the system meets its requirements.
  - **[Test Plan](documents/qualityAssurance/testPlan.md)**
  
- This document provides end-users with instructions on how to use the system and troubleshoot common issues.
  - **[User Manual](documents/manual/userManual.md)**

---

## Developing

### Built With

The list of the main libraries and frameworks used in our project :

| **Category** | **Technology/Tool**   | **Link**                                                                                                  | **Description**                                                                |
| ------------ | --------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Frontend     | React.js              | [<img alt="React Logo" src="./images/react.jpeg" width="30" height="30">](https://react.dev)              | JavaScript library to create dynamic user interfaces.                          |
| Frontend     | D3.js                 | [<img alt="D3.js Logo" src="./images/d3.png" width="30" height="30">](https://d3js.org)                   | Library to create dynamic data visualizations.                                 |
| Backend      | Node.js & Express.js  | [<img alt="Node.js Logo" src="./images/nodeJS.jpg" width="30" height="30">](https://nodejs.org)           | JavaScript server-side runtime environment with a framework for creating APIs. |
| Database     | No DB                 | [<img alt="JSON Logo" src="./images/json.png" width="30" height="30">](https://www.json.org/json-en.html) | Store as JSON.                                                                 |
| Other        | Vite                  | [<img alt="Vite Logo" src="./images/vite.png" width="30" height="30">](https://vitejs.dev)                | Tool to manage and build JavaScript modules.                                   |

**Language:** JS

---

### Prerequisites

To set up the dev environment you'll need to have many dependencies and libraries installed.

All the different installation guide could be found in the [Technical Specifications](documents/technical/technicalSpecifications.md#environment-configuration).

---

## Tests

This section will explain how to run the end to end tests created by the quality assurance of the team. \
We assume that you are at the root of the project and that Node.JS is already installed. \
If not you can fork the project at [this link](https://github.com/algosup/2024-2025-project-4-web-fpga-team-5/fork) and install Node.JS at [this one](https://nodejs.org/en/download).

To test the front-end:

```shell
# Move to the correct folder
cd frontend/

# Dependencies installation
npm i

# Execute the test suites
npm run test:e2e
```

To test the back-end:

```shell
# Move to the correct folder
cd backend/

# Dependencies installation
npm i

# Execute the test suites
npm run test:e2e
```

---

## Contributing

To contribute to our project, please, ensure you follow our conventions you can find in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

---

## API Description

In this section you'll be provided with the link to [API documentation](./documents/technical/APIDocumentation.md).

---

## Changelog

**v1.0.0**:
<!-- TODO -->

---

## Copyrights

**Ownership:** CNES and ALGOSUP
**Third-party Assets:**

- **Images:**
  - CNES Logo (Public Domain)
  - React Logo (MIT License)
  - D3.js Logo (BSD-3-Clause License)
  - Node.js Logo (MIT License)
  - JSON Logo (Public Domain)
  - Vite Logo (MIT License)
  - SPIN Logo (AI Generated)
- **Frontend:**
  - React.js (MIT License)
  - React DOM (MIT License)
  - React Router DOM (MIT License)
  - D3.js (BSD-3-Clause License)
  - TailwindCSS (MIT License)
  - Vite (MIT License)
  - @tailwindcss/vite (MIT License)
- **Backend:**
  - Express.js (MIT License)
  - CORS (MIT License)
  - Multer (MIT License)
  - Jest (MIT License)
  - Supertest (MIT License)

**Copyright Notice:** © 2024 CNES and ALGOSUP. All rights reserved.  

---

## License

<!-- TODO -->

---

## Contacts

To contact our project team. Please, send a message at the following E-mails:

- Project Manager's E-mail: <robin.goumy@algosup.com>
- Program Manager's E-mail: <alexandre.bopp@algosup.com>

For others social media information, please, refer to [Credits And Acknowledgement](#credits-and-acknowledgement).

---

## Credits And Acknowledgement

Particular thanks to Florent from the [CNES](https://cnes.fr/en) for giving us the opportunity to work on this project.

Thanks for the our school, [ALGOSUP](https://algosup.com/en.html) for letting us improve and having such interesting projects.

Finally, thanks to all the team members for those six weeks. \
You can find their profiles underneath.

| Role              | Name             | Contact                                                                                                            |
| ----------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| Project Manager   | Robin GOUMY      | [GitHub](https://github.com/RobinGOUMY) \| [LinkedIn](https://www.linkedin.com/in/robin-goumy-66452832a/)          |
| Program Manager   | Alexandre BOPP   | [GitHub](https://github.com/Boppalex) \| [LinkedIn](https://www.linkedin.com/in/alexandre-bopp-682a97250/)         |
| Technical Leader  | Maxime THIZEAU   | [GitHub](https://github.com/MaximeTAlgosup) \| [LinkedIn](https://www.linkedin.com/in/maxime-thizeau-0b311a293/)   |
| Software Engineer | Geoffrey Delrieu | [GitHub](https://github.com/Z2VvZ2Vv) \| [LinkedIn](https://www.linkedin.com/in/geoffrey-delrieu-77203a353/)       |
| Quality Assurance | Mathias DELILLE  | [GitHub](https://github.com/MistzSoftware) \| [LinkedIn](https://www.linkedin.com/in/mathias-gagnepain-426a131b0/) |
| Technical Writer  | Habi CAILLEAU    | [GitHub](https://github.com/habicll) \| [LinkedIn](https://www.linkedin.com/in/habi-cailleau-3b72b5293/)           |

[Back to the top](#web-fpga---team-5)
