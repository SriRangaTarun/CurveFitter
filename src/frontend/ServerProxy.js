/**
 * A proxy for UI to interact with the ExpressJS server.
 */

  const URL = "http://localhost:3000";

  /**
   * 
   * Retrieves all the recent Curve Fitter tasks.
   */
  export async function getAll() {
        let recents = [];
        await fetch(`${URL}/all`)
        .then(response => response.text())
        .then(body => {
            recents = body;
        })
        .catch (err => {
          console.log('error', err);
        })
        return recents;
    }

  /**
   * 
   * Saves a new Curve Fitter task.
   */
  export async function saveRecent(t)
  {
    t = JSON.parse(t);
    let recents = [];  
    await fetch(`${URL}/create`, { 
      method: 'POST', 
      headers: {
        "Content-Type": "application/json",
      },  
      body: JSON.stringify(t)
    })
    .then(response => response.text())
    .then(body => {
        recents = body;
    })
    .catch (err => {
      console.log('error', err);
    })
    return recents;
  }

  /**
   * 
   * Deletes a Curve Fitter task.
   */
  export async function deleteRecent(id)
  {
    let success = false;

    try {
        if (id.length === 0 || id === 'undefined') {
          return success;
        }
  } catch (error) {
      return success;
  }

  if (id.length > 0) {
      await fetch(`${URL}/delete?id=${id}`, { 
        method: 'DELETE', 
      })
      .then(response => {
        if (response.status === 200) {
          success = true;
        }
      })
      .catch (err => {
        console.log('error', err);
      })
    }
    return success;
  }

  /**
   * 
   * Updates a Curve Fitter task.
   */

  export async function updateRecent(id, priority)
  {
    let success = false;

    try {
        if (id.length === 0 || id === 'undefined') {
          return success;
        }
  } catch (error) {
      return success;
  }


  if (id.length > 0) {
      let t = `{"id": "${id}", "priority": "${priority}" }`;
      await fetch(`${URL}/update`, { 
        method: 'PUT', 
        headers: {
          "Content-Type": "application/json",
        },  
        body: t,
      })
      .then(response => {
        if (response.status === 200) {
          success = true;
        }
      })
      .catch (err => {
        console.log('error', err);
      })
    }
    return success;
  }
