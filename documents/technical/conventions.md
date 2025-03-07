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

<!-- TODO -->