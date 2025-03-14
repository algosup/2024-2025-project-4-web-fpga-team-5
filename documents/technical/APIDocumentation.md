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
| Field   | Type    | Description |
| ------- | ------- | ----------- |
| status  | Number  | 200         |

*Response (example)*
```JSON
[
    "FF1_exemples",
    "FF1_exemples_1"
]
```

**Error 5xx**
| Code | Name         | Description                |
| ---- | ------------ | -------------------------- |
| 500  | Server Error | Error listing directories. |

---
### GET - Obtaining A Single Result From The Server

![Static Badge](https://img.shields.io/badge/GET-darkgreen)
```URL
/api/map/{filename}
```
*{}: parameters*

**Example:**
```
http://localhost:3001/api/map/FF1NorstPostSynthesis.sdf
```

**Parameter:**
| Field    | Type   | Description               |
| -------- | ------ | ------------------------- |
| filename | String | name of the file to load. |

**Success 200**
| Field  | Type   | Description |
| ------ | ------ | ----------- |
| status | Number | 200         |

<!-- TODO: add success example -->
*Response (example)*
```
```

**Error 4xx**
| Code | Name        | Description               |
| ---- | ----------- | ------------------------- |
| 400  | Bad Request | Project name is required. |

*Response (example)*
```HTML
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Error</title>
</head>

<body>
    <pre>Cannot GET /api/map/</pre>
</body>

</html>
```

**Error 5xx**
| Code | Name         | Description                                             |
| ---- | ------------ | ------------------------------------------------------- |
| 500  | Server Error | Error reading parsed SDF JSON file. File may not exist. |

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

body:
{
  "sdf": "RisingEdge_DFlipFlop_AsyncResetHigh_post_synthesis.sdf",
  "v": "RisingEdge_DFlipFlop_AsyncResetHigh_post_synthesis.v"
}
```

**Parameter (request body):**
| Field | Type | Description   |
| ----- | ---- | ------------- |
| file1 | File | SDF file.     |
| file2 | File | Verilog file. |

**Success 200**
| Field  | Type   | Description |
| ------ | ------ | ----------- |
| status | Number | 200         |

**Error 4xx**
| Code | Name        | Description                                  |
| ---- | ----------- | -------------------------------------------- |
| 400  | Bad Request | Both SDF and Verilog files must be uploaded. |
| 400  | Bad Request | One or both uploaded files are empty.        |
| 400  | Bad Request | Project name is required.                    |
| 400  | Bad Request | The project already exists.                  |
| 400  | Bad Request | SDF file already exists.                     |
| 400  | Bad Request | Verilog file already exists.                 |

**Error 5xx**
| Code | Name         | Description                     | 
| ---- | ------------ | ------------------------------- |
| 500  | Server Error | Error parsing SDF file.         |
| 500  | Server Error | Error parsing Verilog file.     |
| 500  | Server Error | Error merging files.            |
| 500  | Server Error | Error saving parsed JSON files. |
| 500  | Server Error | Unexpected server error.        |

<!-- TODO: add examples -->
*Response (example)*
```
```
---
## DELETE Methods

### DELETE - Removing An Existing Application

![Static Badge](https://img.shields.io/badge/DELETE-orange)
```URL
/api/delete-project/{projectName}
```
*{}: parameters*

**Example:**
```
http://localhost:3001/api/delete-project/FF1Examples
```

**Parameter:**
| Field    | Type   | Description               |
| -------- | ------ | ------------------------- |
| filename | String | name of the file to load. |

**Success 200**
| Field   | Type   | Description                     |
| ------- | ------ | ------------------------------- |
| status  | Number | 200                             |
| message | String | Directory deleted successfully. |

**Error 4xx**
| Code | Name        | Description               |
| ---- | ----------- | ------------------------- |
| 400  | Bad Request | Directory does not exist. |

**Error 5xx**
| Code | Name         | Description                                 |
| ---- | ------------ | ------------------------------------------- |
| 500  | Server Error | Error deleting directory, it may not exist. |

<!-- TODO: add examples -->
*Response (example)*
```
```