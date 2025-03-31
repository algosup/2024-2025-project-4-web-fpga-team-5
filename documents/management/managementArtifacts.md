<div align="center">

---

# Management Artifacts - Web FPGA

<img src="../../images/logo.png" width="400" alt="Logo"/>


</div>

<br>

<details>
<summary><b>Table Of Contents</b></summary>

- [Management Artifacts - Web FPGA](#management-artifacts---web-fpga)
  - [Tasks](#tasks)
  - [RACI Matrix](#raci-matrix)
  - [Key Performance Indicators](#key-performance-indicators)
    - [Documents:](#documents)
    - [Design:](#design)
    - [Development:](#development)
    - [Human Resources:](#human-resources)
  - [Risks \& Assumptions](#risks--assumptions)
  - [Mood](#mood)
  - [Weekly Reports](#weekly-reports)

</details>


## Tasks

All information is maintained and updated in Clickup for real-time tracking.

- **All the Tasks:** [View all tasks](https://sharing.clickup.com/9015908151/l/h/8cp7ntq-995/c86b113626f4488)  
  This section lists every task with detailed priorities, assigned roles, and deadlines.

- **Gantt Chart:** [View the Gantt chart](https://sharing.clickup.com/9015908151/g/h/8cp7ntq-1135/93cbe38f66cc00e)
   A visual timeline created in Clickup that outlines project milestones and deadlines.
  

## RACI Matrix  
| Name                     | Project Manager | Program Manager | Software Engineer | QA Engineer | Technical Writer | Client |
|--------------------------|-----------------|-----------------|--------------------|-------------|-------------------|--------|
| Project kick-off         | I               | R/A             | I                  | I           | I                 | C      |
| Requirement Analysis     | R               | A               | C                  | C           | C                 | I      |
| API Development          | A               | C               | R                  | I           | I                 | /      |
| Algorithm Optimization   | C               | I               | R/A                | C           | /                 | /      |
| System Testing           | A               | I               | C                  | R           | C                 | I      |
| Documentation            | C               | R/A             | I                  | I           | R/A               | I      |

**Legend:**

| Letters | Stand for   |
| ------- | ----------- |
| R       | Responsible |
| A       | Accountable |
| C       | Consulted   |
| I       | Informed    |

## Key Performance Indicators

To follow the progress of the project, multiple KPIs have been defined. They can be viewed through our KPIs spreadsheet.

Our KPIs have been separated into different categories as follows:

### Documents: 

- Project Charter
- Functional Specifications
- Technical Specifications
- Test Cases
- Test Plan
- Management Artifacts
- User Manual
- READ.ME


**Formula:**  

<div align="center">

$$\text{Progress (\%)} = \frac{\text{Current Number of Completed Sections}}{\text{Total Predefined Sections}} \times 100$$ 

</div>

### Design: 

- Mock-up
  
You can access to the mock-up following [this link](https://www.figma.com/design/YohFQNPfGWHBlULNmWJFgS/WebFPGA?node-id=0-1&p=f&t=iZloJbAbCTv3OLB5-0).


**Formula:**  

<div align="center">

$$\text{Progress (\%)} = \frac{\text{Current Number of Completed Pages}}{\text{Total Predefined Pages}} \times 100$$ 

</div>

### Development: 

- Back-end 
- Front-end

**Formula:**  

<div align="center">

$$\text{Progress (\%)} = \frac{(\text{Completed Tasks} + \sum \text{Partial Progress on Ongoing Tasks})}{\text{Total Tasks Planned}} \times 100$$  

</div>

### Human Resources: 

- Unjustified Absence Time
- Overtime


You can see our project's KPIs following [this link](https://algosup-my.sharepoint.com/:x:/p/robin_goumy/EYrk5Cafv1dMgymb8nSp5esBLqcweLlJSfQut3MZREPwcA?e=f8d4bO).


##  Risks & Assumptions

| ID  | Description                                                                             | Consequence                                                                         | Impact | Likelihood | Mitigation/Avoidance                                                  |
|-----|-----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|--------|------------|-----------------------------------------------------------------------|
| 1   | Synchronizing the timing simulation with the 2D FPGA visualization may be difficult.    | May lead to incorrect or non-intuitive visual representation.                       | High   | Medium     | Implement careful testing and debugging mechanisms.                   |
| 2   | Users (teachers/students) may have different levels of expertise with FPGA and Verilog. | Some users might struggle with using the tool effectively.                          | Medium | High       | Provide comprehensive documentation.                                  |
| 3   | Teachers may struggle to prepare and upload new FPGA examples.                          | Limits the usability of the tool.                                                   | Medium | High       | Develop a simple and well-documented process for adding new examples. |

## Mood

The mood inside the team is calculated based on the different aspects:
- Motivation
- Management 
- Productivity
- Communication

This is a simple average of the various categories, taking into account team size, number of responses and category evaluation.

This average is currently: 7.8 🌟

## Weekly Reports

Weekly reports are done to ensure a follow of the project. You can find all the files within the [cumulative weekly reports](weeklyReports/cumulative.md).

You can directly access the reports individually:

- [Weekly Report 1](weeklyReports/weeklyReport1.md)
- [Weekly Report 2](weeklyReports/weeklyReport2.md)
- [Weekly Report 3](weeklyReports/weeklyReport3.md)
- [Weekly Report 4](weeklyReports/weeklyReport4.md)
- [Weekly Report 5](weeklyReports/weeklyReport5.md)
- [Weekly Report 6](weeklyReports/weeklyReport6.md)

<!-- ## Post Mortem -->