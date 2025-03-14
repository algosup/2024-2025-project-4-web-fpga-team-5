# Technical Specifications - Web FPGA

## Introduction

This documentation is here for the user to know how to use effeciently our API without opening the source code.

Our API as 4 endpoints which are listed below.

## GET Methods

### GET - Obtaining The Entire List Of Existing Applications

![Static Badge](https://img.shields.io/badge/GET-darkgreen)
```URL
/api/list
```

**Example:**
```
http://localhost:3001/api/list
```

**No parameters**

**Success 200**
| Field | Type | Description |
| ----- | ---- | ----------- |
||||

**Error 4xx**
| Name | Description |
| ---- | ----------- |
|||

*Response (example)*
```
```
---
### GET - Obtaining A Single Result From The Server

![Static Badge](https://img.shields.io/badge/GET-darkgreen)
```URL
/api/map/{filename}
```
*{}: parameters*

<!-- TODO: To complete -->
**Example:**
```
http://localhost:3001/api/map/
```

**Parameter:**
| Field | Type | Description |
| ----- | ---- | ----------- |
| filename | String | name of the file to load. |

**Success 200**
| Field | Type | Description |
| ----- | ---- | ----------- |
||||

**Error 4xx**
| Name | Description |
| ---- | ----------- |
|||

*Response (example)*
```
```
---
## POST Methods

### POST - Updating An Existing File

![Static Badge](https://img.shields.io/badge/POST-yellow)
```URL
/api/upload/
```

<!-- TODO: To complete -->
**Example:**
```
http://localhost:3001/api/upload/
```

**Parameter (request body):**
| Field | Type | Description |
| ----- | ---- | ----------- |
| file1 | File | SDF file. |
| file2 | File | Verilog file. |

**Success 200**
| Field | Type | Description |
| ----- | ---- | ----------- |
||||

**Error 4xx**
| Name | Description |
| ---- | ----------- |
|||

*Response (example)*
```
```
---
## DELETE Methods

### DELETE - Removing An Existing Application

![Static Badge](https://img.shields.io/badge/DELETE-orange)
```URL
/api/delete/{filename}
```
*{}: parameters*

<!-- TODO: To complete -->
**Example:**
```
http://localhost:3001/api/delete/
```

**Parameter:**
| Field | Type | Description |
| ----- | ---- | ----------- |
| filename | String | name of the file to load. |

**Success 200**
| Field | Type | Description |
| ----- | ---- | ----------- |
||||

**Error 4xx**
| Name | Description |
| ---- | ----------- |
|||

*Response (example)*
```
```