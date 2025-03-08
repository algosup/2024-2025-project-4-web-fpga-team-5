# Conventions - Web FPGA

## Table Of Content

- [GitHub Conventions](#github-conventions)
  - [Branches](#branches)
  - [Folders](#folders)
  - [Files](#files)
  - [Commits](#commits)
- [Document Conventions](#document-conventions)
  - [Title](#title)
  - [Headers](#headers)
  - [Contents](#contents)
- [Coding Conventions](#coding-conventions)
  - [Components](#components)
  - [Props](#props)
  - [State Variables](#state-variables)
  - [Event Handlers](#event-handlers)
  - [CSS Classes](#css-classes)
  - [Constants](#constants)
  - [Utility Functions](#utility-functions)

## GitHub Conventions

### Branches

Many branches would be created to simplify the overall project. It should be named in `kebab-case`.

>[!CAUTION]
> Wrong Examples:
> - Documents
> - Login_Page

>[!TIP]
> Right Examples:
> - documents
> - login-page

### Folders

All the folders in the repository would be written in `camelCase`.

>[!CAUTION]
> Wrong Examples:
> - Documents
> - Quality_Assurance

>[!TIP]
> Right Examples:
> - documents
> - qualityAssurance

### Files

All the files would be written in `camelCase`.

>[!CAUTION]
> Wrong Examples:
> - management_artifacts.md
> - FUNCTIONAL_SPECIFICATIONS.md

>[!TIP]
> Right Examples:
> - managementArtifacts.md
> - functionalSpecifications.md

### Commits

Commits would follow different conventions, aiming to a better understanding of the overall commit.

- The name of the commit should start with a verb in preterit explaining what as be done within the commit:

>[!CAUTION]
> Wrong Examples:
> - last update
> - oupsie

>[!TIP]
> Right Examples:
> - Updated the log-in page.
> - Fixed the issue #33.

- A more detailed description could, and is recommended, be written.

>[!CAUTION]
> Wrong Example:
> - {feature name}

>[!TIP]
> Right Examples:
> - added {feature name}
> - wrote comments for {function name}

- a coworker should be added if the work was done in pair.

## Document Conventions

### Title

The title of a document should contain the file and project names.

>[!CAUTION]
> Wrong Examples:
> - \# Planning Strategy Of Web FPGA Project
> - \# Test Plan - Team 5

>[!TIP]
> Right Examples:
> - \# Test Plan - Web FPGA
> - \# Conventions - Web FPGA

### Headers

All words in a header should start with a capital case.

>[!CAUTION]
> Wrong Examples:
> - \### headers
> - \## coding_conventions

>[!TIP]
> Right Examples:
> - \### Headers
> - \## Coding Conventions

### Contents

Documents should be written in American English and not in British English.

>[!CAUTION]
> Wrong Examples:
> - colour
> - optimise

>[!TIP]
> Right Examples:
> - color
> - optimize

## Coding Conventions

### Components

Components should be written in `PascalCase`.

>[!CAUTION]
> Wrong Examples:
> - const todoItem
> - interface todoItem
> - type todoList

>[!TIP]
> Right Examples:
> - const TodoItem
> - interface TodoItem
> - type TodoList

### Props

Use descriptive names for props to clearly indicate their purpose. Avoid abbreviations or acronyms unless they are widely understood in the context of your project.

>[!CAUTION]
> Wrong Example:
> - Usr

>[!TIP]
> Right Example:
> - User

### State Variables

Prefix state variables with `is`, `has`, or `should` to denote boolean values.

>[!CAUTION]
> Wrong Examples:
> - const [Active, setActive] = useState(false);
> - const [Error, setError] = useState(false);
> - const [Render, setRender] = useState(false);

>[!TIP]
> Right Examples:
> - const [isActive, setIsActive] = useState(false);
> - const [hasError, setHasError] = useState(false);
> - const [shouldRender, setShouldRender] = useState(false);

### Event Handlers

Use `handle` as a prefix for event handler functions.

>[!CAUTION]
> Wrong Examples:
> - const ButtonClick = () => {}
> - const InputChange = () => {}

>[!TIP]
> Right Examples:
> - const handleButtonClick = () => {}
> - const handleInputChange = () => {}

### CSS Classes

Use `kebab-case` for CSS classes names.

>[!CAUTION]
> Wrong Examples:
> - \<div className="WrongExample">
> - \<div className="Example_Container">

>[!TIP]
> Right Examples:
> - \<div className="good-example">
> - \<div className="example-container">

### Constants

Use `SCREAMING_CASE` for the constants naming.

>[!CAUTION]
> Wrong Examples:
> - const api_url
> - const max_result

>[!TIP]
> Right Examples:
> - const API_URL
> - const MAX_RESULT

### Utility Functions

Choose descriptive names that indicate their purpose or functionality. Use `camelCase` for their names.

>[!CAUTION]
> Wrong Examples:
> - const FormatDate = (date) => {}
> - const generate-unique-id = () => {}

>[!TIP]
> Right Examples:
> - const formatDate = (date) => {}
> - const generateUniqueId = () => {}