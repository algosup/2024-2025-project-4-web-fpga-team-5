# Quality Assurance Test Plan

<details>

<summary>Table of contents</summary>

- [Quality Assurance Test Plan](#quality-assurance-test-plan)
  - [1. Introduction](#1-introduction)
    - [1.1 Purpose](#11-purpose)
    - [1.2 Scope](#12-scope)
    - [1.3 Objectives](#13-objectives)
    - [1.4 References](#14-references)
  - [2. Test Items](#2-test-items)
    - [2.1 Features to be Tested](#21-features-to-be-tested)
    - [2.2 Features Not to be Tested](#22-features-not-to-be-tested)
  - [3. Test Strategy](#3-test-strategy)
    - [3.1 Testing Types](#31-testing-types)
    - [3.2 Testing Levels](#32-testing-levels)
    - [3.3 Test Design Techniques](#33-test-design-techniques)
  - [4. Test Environment](#4-test-environment)
    - [4.1 Hardware](#41-hardware)
    - [4.2 Software](#42-software)
  - [5. Test Schedule](#5-test-schedule)
  - [6. Test Deliverables](#6-test-deliverables)
  - [7. Roles and Responsibilities](#7-roles-and-responsibilities)
  - [8. Defect Management](#8-defect-management)
    - [8.1 Defect Reporting](#81-defect-reporting)
    - [8.2 Defect Tracking](#82-defect-tracking)
  - [9. Risks and Contingencies](#9-risks-and-contingencies)
  - [Glossary](#glossary)

</details>

## 1. Introduction

### 1.1 Purpose

This document defines the methodology, resources, schedule, and deliverables for testing the system to ensure it meets functional, performance, security, and usability requirements. It serves as a blueprint for stakeholders to understand the testing process and quality benchmarks.

### 1.2 Scope

Testing covers:

- Functional validation against requirements specifications.
- Non-functional testing (performance, security, compatibility, usability).
- Integration with external systems/APIs.
- Regression testing after code changes.
- Cross-browser/device compatibility (if applicable).

**Exclusions**:  

- Legacy components marked "out of scope" in requirements.
- Third-party systems with existing SLAs.

### 1.3 Objectives

- Validate alignment with business/technical requirements.
- Identify defects prior to production release.
- Ensure system stability under expected load conditions.
- Verify data integrity and security controls.
- Confirm seamless integration with dependencies.
- Provide actionable metrics for release readiness.

### 1.4 References

<!-- TODO: Provide references to related documents, standards, or guidelines. (Tech specs, func specs, etc...) -->

## 2. Test Items

### 2.1 Features to be Tested

<!-- TODO: List the features and functionalities to be tested. -->

### 2.2 Features Not to be Tested

| Feature                              | Reason for Exclusion       |
| ------------------------------------ | -------------------------- |
| Third-Party DigitalJS Online         | Covered under vendor's SLA |
| Third-Party Verilog to Routing (VTR) | Covered under vendor's SLA |
| Third-Party OSS CAD Suite            | Covered under vendor's SLA |
| Third-Party YoWASP                   | Covered under vendor's SLA |
| Third-Party python-sdf-timing        | Covered under vendor's SLA |

## 3. Test Strategy

### 3.1 Testing Types

- **Functional**: Requirement-driven tests (manual/automated).
- **Performance**: Load (expected traffic), Stress (breaking point), and Endurance (24h+ runtime) testing.
- **Compatibility**: Browser/OS matrix, mobile device testing. <!-- TODO: Verify if a mobile version should be available -->
- **Usability**: UX validation against WCAG 2.1 guidelines.

### 3.2 Testing Levels

1. **Unit Testing**: Developer-led component tests (JUnit, pytest). <!-- TODO: Change framework depending of the technology choose by the TL-->
2. **Integration Testing**: API/contract testing (Postman, Pact). <!-- TODO: Change depeding on the architecture defined by the TL -->
3. **System Testing**: End-to-end workflows (Cypress).
4. **UAT**: Business-user validation in staging environment.

### 3.3 Test Design Techniques

<!-- TODO: Describe the techniques used to design test cases (e.g., boundary value analysis, equivalence partitioning). -->

## 4. Test Environment

### 4.1 Hardware

<!-- TODO: List the hardware requirements for the test environment. -->

### 4.2 Software

<!-- TODO: List the software requirements for the test environment. -->

## 5. Test Schedule

<!-- TODO: Provide a timeline for the testing activities, including start and end dates for each phase. -->

## 6. Test Deliverables

<!-- TODO: List the deliverables that will be produced during the testing process (e.g., test cases, test scripts, test reports). -->

## 7. Roles and Responsibilities

<!-- TODO: Define the roles and responsibilities of the testing team members. -->

## 8. Defect Management

### 8.1 Defect Reporting

<!-- TODO: Describe the process for reporting defects. -->

### 8.2 Defect Tracking

- **Dashboard**: Real-time Jira board with filters (e.g., "Critical Bugs").
- **SLA**: Critical (24h), High (72h), Medium (1 sprint), Low (backlog).
- **Closure**: Retest after fix, attach evidence, update status.

## 9. Risks and Contingencies

| Risk                        | Impact                       | Mitigation                               |
| --------------------------- | ---------------------------- | ---------------------------------------- |
| Delayed environment setup   | Testing timeline compression | Pre-provision cloud backups              |
| Critical defects found late | Release postponement         | Shift-left testing; daily defect reviews |
| Third-party API downtime    | Blocked integration tests    | Mock servers (WireMock)                  |
| Resource attrition          | Knowledge gaps               | Cross-training; detailed runbooks        |

## Glossary

| Term | Definition                                                                                                                                                                                                                       |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SLA  | A service-level agreement is an agreement between a service provider and a customer. Particular aspects of the service – quality, availability, responsibilities – are agreed between the service provider and the service user. |
| UAT | User Acceptance Testing |
