# Quality Assurance Test Plan

<details>

<summary>Table Of Contents</summary>

- [Quality Assurance Test Plan](#quality-assurance-test-plan)
  - [1. Introduction](#1-introduction)
    - [1.1 Purpose](#11-purpose)
    - [1.2 Scope](#12-scope)
    - [1.3 Objectives](#13-objectives)
    - [1.4 References](#14-references)
  - [2. Test Items](#2-test-items)
    - [2.1 Features To Be Tested](#21-features-to-be-tested)
    - [2.2 Features Not To Be Tested](#22-features-not-to-be-tested)
  - [3. Test Strategy](#3-test-strategy)
    - [3.1 Testing Types](#31-testing-types)
    - [3.2 Testing Levels](#32-testing-levels)
    - [3.3 Test Design Techniques](#33-test-design-techniques)
  - [4. Test Environment](#4-test-environment)
    - [4.1 Hardware](#41-hardware)
    - [4.2 Software](#42-software)
  - [5. Test Schedule](#5-test-schedule)
  - [6. Test Deliverables](#6-test-deliverables)
  - [7. Roles And Responsibilities](#7-roles-and-responsibilities)
  - [8. Defect Management](#8-defect-management)
    - [8.1 Defect Reporting Process](#81-defect-reporting-process)
    - [8.2 Defect Tracking](#82-defect-tracking)
  - [9. Risks And Contingencies](#9-risks-and-contingencies)
  - [Glossary](#glossary)

</details>

## 1. Introduction

### 1.1 Purpose

This document outlines the testing methodologies, resources, timelines, and deliverables required to ensure the software meets functional, performance, security, and usability requirements. It provides a clear framework for test execution and quality assurance.

### 1.2 Scope

The scope of testing includes:

- Functional validation against business and technical requirements.
- Non-functional testing: performance, security, compatibility, usability.
- API and third-party system integration validation.
- Regression testing to ensure stability after code changes.
- Cross-platform and browser compatibility.

**Exclusions:**

- Legacy components designated as out-of-scope.
- Third-party services covered under vendor SLAs.

### 1.3 Objectives

- Ensure compliance with functional and technical requirements.
- Detect and resolve defects before production deployment.
- Validate system performance under expected workloads.
- Ensure robust security measures and data integrity.
- Facilitate smooth integration with external systems.
- Provide actionable quality metrics for release decisions.

### 1.4 References

- [Functional Specifications](../functional/functionalSpecifications.md)
- [Technical Specifications](../technical/technicalSpecifications.md)
- [Regression Testing Plan](./regressionPlan.md)
- [Defect Management Process](./defectManagementProcess.md)
- [API Documentation](../technical/APIDocumentation.md)
- [Test Cases](https://github.com/orgs/algosup/projects/60)

## 2. Test Items

### 2.1 Features To Be Tested

| Feature                     | Description                                                             |
| --------------------------- | ----------------------------------------------------------------------- |
| Web Interface               | Validate UI/UX, responsiveness, and accessibility.                      |
| API Integration             | Verify API request/response handling.                                   |
| Performance Testing         | Assess system behavior under load.                                      |
| Error Handling              | Ensure proper error handling.                                           |
| Regression Testing          | Validate previously tested functionalities.                             |
| Cross-Browser Compatibility | Ensure the web application works across different browsers and devices. |

### 2.2 Features Not To Be Tested

| Feature                              | Reason for Exclusion       |
| ------------------------------------ | -------------------------- |
| Third-Party DigitalJS Online         | Covered under vendor's SLA |
| Third-Party Verilog to Routing (VTR) | Covered under vendor's SLA |
| Third-Party OSS CAD Suite            | Covered under vendor's SLA |
| Third-Party YoWASP                   | Covered under vendor's SLA |
| Third-Party python-sdf-timing        | Covered under vendor's SLA |

For detailed test cases, refer to the [Test Cases](https://github.com/orgs/algosup/projects/60).

## 3. Test Strategy

### 3.1 Testing Types

- **Functional Testing:** Verification of core functionalities.
- **Performance Testing:** Load, stress, endurance testing.
- **Security Testing:** Penetration testing.
- **Compatibility Testing:** Browser/OS compatibility validation.
- **Usability Testing:** Compliance with WCAG 2.1 guidelines.

### 3.2 Testing Levels

| Level of testing | Name                    | Description                               |
| ---------------- | ----------------------- | ----------------------------------------- |
| 1                | **Unit Testing**        | Component-level testing by developers.    |
| 2                | **Integration Testing** | Validation of APIs, third-party services. |
| 3                | **System Testing**      | End-to-end testing of complete workflows. |
| 4                | **UAT**                 | Business-user validation in staging.      |
| 5                | **Regression Testing**  | Post-release validation of existing code. |

### 3.3 Test Design Techniques

- Boundary Value Analysis
- Equivalence Partitioning
- Error Guessing
- State Transition Testing

## 4. Test Environment

### 4.1 Hardware

- Servers:
  - GitHub-Hosted Runners (Executing tests): Ubuntu (x64), 4-core CPU, 16GB RAM, 14GB SSD.
  - Render.com (Web Server): 512MB RAM, 0.1 CPU.
- Work stations:
  - MacBook Air (macOS Sequoia): 16GB RAM, 500GB SSD, CPU M3.
  - Lenovo ThinkBook 14 G4 IAP (Windows 11): 16 GM RAM, 512GB SSD, CPU I7 12th gen.
- Test stations:
  - MacBook Air (macOS Sequoia): 16GB RAM, 500GB SSD, CPU M3.
  - Lenovo ThinkBook 14 G4 IAP (Windows 11): 16 GM RAM, 512GB SSD, CPU I7 12th gen.

### 4.2 Software

- **Testing Tools:** Selenium, Jest, Postman, Supertest, Mocha
- **CI/CD:** GitHub Actions, Render.com deployment hooks

## 5. Test Schedule

Tests will be executed before each release and at each push to ensure code quality. Additionally, manual testing will be performed occasionally to ensure that nothing is missed by automated tests.

## 6. Test Deliverables

- Test Plan
- Test Cases
- Defect Reports
- Test Execution Reports
- Regression Testing Results

## 7. Roles And Responsibilities

| Role              | Responsibilities                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| Quality Assurance | Test planning, monitoring, risk management, test execution, defect reporting, and documentation. |
| Software Engineer | Unit testing, defect resolution.                                                                 |

## 8. Defect Management

### 8.1 Defect Reporting Process

1. Log defect with severity, priority, and environment details.
2. Assign to the development team for resolution.
3. Verify fix and retest.
4. Update defect status to "Closed" upon successful validation.

### 8.2 Defect Tracking

- **GitHub Projects:** Kanban board for defect tracking.
- **Slack Alerts:** Automated notifications for new defects.
- **Daily Triage Meetings:** Review and prioritize reported issues.

| Severity | Impact                                    | Resolution Time       |
| -------- | ----------------------------------------- | --------------------- |
| Critical | Blocks major functionality                | Fix within 24 hours   |
| High     | Affects key features, but has workarounds | Fix within 72 hours   |
| Medium   | Non-blocking but impacts user experience  | Fix within one sprint |
| Low      | Minor UI issues or enhancements           | Added to backlog      |

For detailed information on defect management, please refer to the [Defect Management Document](./defectManagementProcess.md).

## 9. Risks And Contingencies

| Risk                     | Impact                       | Mitigation                          |
| ------------------------ | ---------------------------- | ----------------------------------- |
| Delayed test environment | Testing timeline compression | Use Infrastructure-as-Code (IaC).   |
| API downtime             | Blocked integration tests    | Implement mocks/stubs.              |
| Resource attrition       | Knowledge gaps               | Maintain documentation and backups. |

## Glossary

| Term  | Definition                                                                                                                                                                                                                            |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SLA   | A service-level agreement is an agreement between a service provider and a customer. Particular aspects of the service – quality, availability, responsibilities – are agreed upon between the service provider and the service user. |
| UAT   | User Acceptance Testing                                                                                                                                                                                                               |
| API   | Application Programming Interface, a set of rules that allows different software entities to communicate with each other.                                                                                                             |
| WCAG  | Web Content Accessibility Guidelines, a set of guidelines for making web content more accessible to people with disabilities.                                                                                                         |
| IaC   | Infrastructure as Code, the process of managing and provisioning computing infrastructure through machine-readable definition files.                                                                                                  |
| CI/CD | Continuous Integration and Continuous Deployment, a method to frequently deliver apps to customers by introducing automation into the stages of app development.                                                                       |
| CPU   | Central Processing Unit, the primary component of a computer that performs most of the processing inside a computer.                                                                                                                  |
| SSD   | Solid State Drive, a type of mass storage device similar to a hard disk drive (HDD).                                                                                                                                                  |
| RAM   | Random Access Memory, a form of computer memory that can be read and changed in any order, typically used to store working data and machine code.                                                                                      |
| VTR   | Verilog to Routing, a tool for the physical design of digital circuits.                                                                                                                                                               |
| OSS   | Open Source Software, software with source code that anyone can inspect, modify, and enhance.                                                                                                                                         |
| Kanban| A visual workflow management method used to visualize work, maximize efficiency, and improve continuously.                                                                                                                             |
| Triage| The process of determining the priority of patients' treatments based on the severity of their condition. In software, it refers to prioritizing issues based on their severity and impact.                                           |
