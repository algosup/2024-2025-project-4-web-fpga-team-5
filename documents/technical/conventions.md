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

**Wrong example** ❌

```
Documents
Login_Page
```

**Right Example** ✅

```
documents
login-page
```

### Folders

All the folders in the repository would be written in `camelCase`.

**Wrong example** ❌

```
Documents
Quality_Assurance
```

**Right Example** ✅

```
documents
qualityAssurance
```

### Files

All the files would be written in `camelCase`.

**Wrong example** ❌

```
management_artifacts.md
FUNCTIONAL_SPECIFICATIONS.md
```

**Right Example** ✅

```
managementArtifacts.md
functionalSpecifications.md
```

### Commits

Commits would follow different conventions, aiming to a better understanding of the overall commit.

- The name of the commit should start with a verb in preterit explaining what as be done within the commit:

**Wrong example** ❌

```
last update
oupsie
```

**Right Example** ✅

```
Updated the log-in page.
Fixed the issue #33.
```

- A more detailed description could, and is recommended, be written.

**Wrong example** ❌

```
- {feature name}
```

**Right Example** ✅

```
- added {feature name}
- wrote comments for {function name}
```

- a coworker should be added if the work was done in pair.

## Document Conventions

### Title

The title of a document should contain the file and project names.

**Wrong example** ❌

```
# Planning Strategy Of Web FPGA Project
# Test Plan - Team 5
```

**Right Example** ✅

```
# Test Plan - Web FPGA
# Conventions - Web FPGA
```

### Headers

All words in a header should start with a capital case.

**Wrong example** ❌

```
### headers
## coding_conventions
```

**Right Example** ✅

```
### Headers
## Coding Conventions
```

### Contents

Documents should be written in American English and not in British English.

**Wrong example** ❌

```
colour
optimise
```

**Right Example** ✅

```
color
optimize
```

## Coding Conventions

<!-- TODO -->