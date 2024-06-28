/**
 * Serve API endpoints 
 *
**/
import express from "express";
import logger from "morgan";
import * as db from "./db.js";

const app = express();
const port = 3000;
app.use(logger("dev"));
app.use(express.json());
app.use(express.static('src/frontend'))
app.use(express.urlencoded({ extended: false }));

const headerFields = { "Content-Type": "text/json" };


/**
 * Asynchronously creates a Curve Fitter task.
 */
async function saveRecentToDB(response, data) {
  if (data === undefined) {
    response.writeHead(400, headerFields);
    response.write("<h1>Incorrect recent information</h1>");
    response.end();
  } else {
    try {
      // generate a random, unique alphanumeric ID with a length of 5.
      db.addRecentTask(generateUniqueID(5), data)
      response.end();
      } catch (err) {
      response.writeHead(500, headerFields);
      response.write("<h1>Internal Server Error</h1>", err);
      response.end();
    }
  }
}

/**
 * Asynchronously deletes a Curve Fitter task.
 */
async function deleteRecentFromDB(response, id) {
  if (id == undefined || id === null) {
    response.writeHead(400, headerFields);
    response.write("<h1>Incorrect recent information</h1>");
    response.end();
  } else {
      db.loadRecent(id).then(doc => {
        db.deleteRecentTask(doc)
        response.writeHead(200, headerFields);
        response.write(`deleted with success: ${id}`)
        response.end();
        })
        .catch (err => {
          response.writeHead(500, '{ "Content-Type": "text/html" }');
          response.end();
        });
  }
}

/**
 * Asynchronously updates a Curve Fitter task.
 */
async function updateRecentFromDB(response, id, isPriority) {
  console.log ('chaning to :', isPriority);
  if (id == undefined || id === null) {
    response.writeHead(400, headerFields);
    response.write("<h1>Incorrect recent information</h1>");
    response.end();
  } else {
      db.loadRecent(id)
      .then(doc => {
        doc.task.priority=isPriority;
        db.modifyRecent(doc)
        response.writeHead(200, headerFields);
        response.write(`modified with success: ${id}`)
        response.end();
        })
        .catch (err => {
          response.writeHead(500, '{ "Content-Type": "text/html" }');
          response.end();
        });
  }
}

/**
 * Asynchronously retrieves all the current Curve Fitter tasks.
 */

async function getRecentsFromDB(response) {
  try {
    let d = null;
    await db.loadRecentTasks().then (dbResult => { d = dbResult})
    response.json(d);
    response.end();
  } catch (err) {
    response.writeHead(500, headerFields);
    response.write("<h1>Internal Server Error</h1>");
    response.write("<p>Unable to load recents</p>");
    response.write(`<pre>${err}</pre>`);
    response.end();
  }
}

/**
 * Asynchronously handles endpoints that are not implemented.
 */
const MethodNotAllowedHandler = async (request, response) => {
  response.send("Not Implemented"); // you should change this!
};

/**
 * HTTP route to handle updating a Curve Fitter task.
 */
app
  .route("/update")
  .put(async (request, response) => {
    updateRecentFromDB(response, request.query.id, request.query.priority)
  })
  .all(MethodNotAllowedHandler);

  /**
 * HTTP route to handle deleting a Curve Fitter task.
 */
app
  .route("/delete")
  .delete(async (request, response) => {
    deleteRecentFromDB(response, request.query.id)
  })
  .all(MethodNotAllowedHandler);

/**
 * HTTP route to handle  creating a Curve Fitter task.
 */
app
  .route("/create")
  .post(async (request, response) => {
    saveRecentToDB(response, request.body)
  })
  .all(MethodNotAllowedHandler);

/**
 * HTTP route to handle  retrieving all the Curve Fitter tasks.
 */
app
  .route("/all")
  .get(async (request, response) => {
   getRecentsFromDB(response);
  })
  .all(MethodNotAllowedHandler);

/**
 * HTTP route to handle static files.
 */
app
.route("/")
.get(async (request, response) => {
  var options = {root: 'src/frontend'};
  response.sendFile('index.html', options, function(error) {
    if (error) {
      console.log (error);
      response.writeHead(500);
      response .end();
    }
  })
})  
.all(MethodNotAllowedHandler);

/**
 * HTTP route to handle not-available endpoints.
 */

app.route("*").all(async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

/**
 * Starts the server.
 */
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

/**
 * Generates a random, unique alpha numeric ID (of `max` digits) to store Curve Fitter tasks
 **/
function generateUniqueID(max) {
  // 36 == 26 + 10 (alphanumeric)
  return (Math.random() + 1).toString(36).substring(max)
}
