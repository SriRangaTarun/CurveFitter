/**
 * Store recent interactions with Curve Fitter 
 *
 * This module provides a set of asynchronous functions for creating, reading,
 * updating, and deleting Curve fitter's tasks in a PouchDB database. The module is built
 * on top of PouchDB, a NoSQL database, to persist Curve Fitter  data.
 *
 * HOWEVER: it can easily be changed to a different data store simply by
 * replacing the PouchDB implementation with another database system.
 *
 * Functions:
 * - `addRecentTask(name, task)`: Saves a new Curve Fitter task.
 * - `modifyRecent(doc)`: Updates an existing Curve Fitter task in the database.
 * - `loadRecent(name)`: Retrieves a Curve Fitter task by its name.
 * - `deleteRecentTask(doc)`: Removes a Curve Fitter task from the database by its name.
 * - `loadRecentTasks()`: Fetches all Curve Fitter tasks from the database.
 *
 * Dependencies:
 * - PouchDB: Used for data storage and retrieval operations. Ensure PouchDB is
 *   installed and properly configured.
 *
 * Note: This module can easily change the database implementation to another
 * database system by changing the import statement and the database connection
 * initialization. The rest of the functions should work as expected with minor
 * modifications.
 */
import PouchDB from "pouchdb";

const db = new PouchDB("recents");

/**
 * Asynchronously saves a new Curve Fitter task to the database with a specified name and
 * task. If a Curve Fitter task with the same name already exists, it will be
 * overwritten.
 *
 * @async
 * @param {string} name - The unique identifier for the Curve Fitter task.
 * @param {string} task - Curve Fitter task in a JSON format.
 * @returns {Promise<void>} - A promise that resolves when the Curve Fitter task has been
 * successfully saved.
 * @throws {Error} - Throws an error if the operation fails, e.g., due to
 * database connectivity issues.
 */
export async function addRecentTask(name, task) {
  await db.put({ _id: name, task });
}

/**
 * Asynchronously retrieves all Curve Fitter tasks from the database.
 *
 * @async
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of
 * Curve Fitter task documents.
 * @throws {Error} - Throws an error if there is a problem accessing the
 * database.
 */
export async function loadRecentTasks() {
  const result = await db.allDocs({ include_docs: true });
  return result.rows.map((row) => row.doc);
}

/**
 * Asynchronously removes a Curve Fitter task from the database by its name.
 *
 * @async
 * @param {string} doc - The JSON form of the Curve Fitter task to be removed.
 * @returns {Promise<void>} - A promise that resolves when the Curve Fitter task has been
 * successfully removed.
 * @throws {Error} - Throws an error if the Curve Fitter  cannot be removed, e.g., it
 * does not exist or due to database issues.
 */
export async function deleteRecentTask(doc) {
  db.remove(doc);
}

/**
 * Asynchronously loads an existing Curve Fitter task from the database. The Curve Fitter task
 * document must include an `_id` property that matches the Curve Fitter task's name in
 * the database.
 *
 * @async
 * @param {string} name - Name of the the Curve Fitter task document to be updated.
 * @returns {Promise<void>} - A promise that resolves when the Curve Fitter task has been
 * successfully retrieved.
 * @throws {Error} - Throws an error if the operation fails, e.g., the Curve Fitter task
 * does not exist or database issues.
 */
export async function loadRecent(name) {
  const doc = await db.get(name);
  return doc;
}

/**
 * Asynchronously modifies an existing Curve Fitter task in the database. The Curve Fitter task
 * document must include an `_id` property that matches the Curve Fitter task's name in
 * the database.
 *
 * @async
 * @param {Object} doc - The Curve Fitter task document to be updated. Must include `_id`
 * and `task` properties.
 * @returns {Promise<void>} - A promise that resolves when the Curve Fitter task has been
 * successfully modified.
 * @throws {Error} - Throws an error if the operation fails, e.g., the Curve Fitter task
 * does not exist or database issues.
 */
export async function modifyRecent(doc) {
  await db.put(doc);
}