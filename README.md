# Curve Fitter
## Project setup
To get started with the project, follow these steps:
1. **Clone the Repository:**
   ```sh
   git clone https://github.com/srirangatarun/my-web-application
   cd my-web-application
   npm install
   npm start
# Overview
Generates graphs for a given set of coordinates (x,y) and a functional family (a Curve Fitter task).
A recent list of tasks is maintained, users can choose a prior task (to generate graph) from the recent list of tasks. 
Possible user actions (CRUD) include:
- create a new task
- Delete a task
- Update priority of a recent task
- Retrieve all the recent tasks
# Design
For this application, ExpressJS and PouchDB are used to serve API traffic and handle persistance.

## API endpoints for user actions (CRUD operations):

###  Purpose:
   Retrieve all the recent Curve Fitter actions.
#### Endpoint:
   # Curve Fitter
## Project setup
To get started with the project, follow these steps:
1. **Clone the Repository:**
   ```sh
   git clone https://github.com/srirangatarun/my-web-application
   cd my-web-application
   npm install
   npm start
# Overview
Generates graphs for a given set of coordinates (x,y) and a functional family (a Curve Fitter task).
A recent list of tasks is maintained, users can choose a prior task (to generate graph) from the recent list of tasks. 
Possible user actions (CRUD) include:
- create a new task
- Delete a task
- Update priority of a recent task
- Retrieve all the recent tasks
# Design
For this application, ExpressJS and PouchDB are used to serve API traffic and handle persistance.

## API endpoints for user actions (CRUD operations):

###  Purpose:
   Retrieve all the recent Curve Fitter actions.
#### Endpoint:
   http://localhost:3000/all
#### HTTP Method:
   GET
#### Parameters:
   NA
#### Request Body:
   NA
#### Response Body:
   - HTTP status of 200 and JSON with an array of recent actions:
      [
      {
         "task": {
               "coordinates": "(1,2) (3,4)",             // coordinates to plot
               "family": "mx+c",                         // curve to fit
               "priority": "false"                       // priority of a recent task (defaults to `false`)
         },
         "_id": "22kek0a",                             // Unique, random alphanumeric ID used to store in the DB
         "_rev": "1-8f1ed88f6ed26920f6af599c64e7c480"  // verion of this task in the DB
      }
      ]
   - In case of application error, returns HTTP 500 with the following error message:
         `
          <h1>Internal Server Error</h1>
          <p>Unable to load recents</p>
          <pre>${err}</pre>
          `

###  Purpose:
   Create a new Curve Fitter task.
#### Endpoint:
   http://localhost:3000/create
#### HTTP Method:
   POST
#### Parameters:
   NA
#### Request Body:
   A JSON object for the new task to be created.
   `
   {
   coordinates: "(2,2), (4,4)", 
   family: "mx+c", 
   priority: "false"
   }
   `
#### Response Body:
   HTTP status of 200 is returned with none is returned as part of the HTTP response body.


###  Purpose:
   Delete a Curve Fitter task.
#### Endpoint:
   http://localhost:3000/delete
#### HTTP Method:
   DELETE
#### Parameters:
   ID of the task to be deleted.
#### Request Body:
   NA
#### Response Body:
   -  HTTP status of 200 is returned with none is returned as part of the HTTP response body.
   - In case of application error, returns HTTP 500 with the following error message:
         `
          <h1>Internal Server Error</h1>
          `

###  Purpose:
   update priority for a Curve Fitter task.
#### Endpoint:
   http://localhost:3000/update
#### HTTP Method:
   PUT
#### Parameters:
   NA
#### Request Body:
   A JSON object the task to be updated.
   `
   {
      id : "fdfs8",     // ID for the task
      priority: "false" // updated priority 
   }
   `
#### Response Body:
   -  HTTP status of 200 is returned along with `modified with success: id` as the response body.
   - In case of application error, returns HTTP 500 with the following error message:
         `
          <h1>Internal Server Error</h1>
