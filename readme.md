# CELER

This is the backend for the Celer app. It's a REST API built with Node.js, Express, and MongoDB. The views directory is only for testing purposes. The frontend will be built with svelte.

---

## Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Dlurak/celerBackend.git
   ```
2. Install NPM packages
    ```sh
    npm i
    ```
3. Create a `config.json` file and add this:
    ```json
    {
        "mongoDbPassword": "",
        "mongoDbUser": "",
        "passwordRegex": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
        "sessionSecret": "",
    }
    ```

    The *mongoDbPassword* and *mongoDbUser* are the credentials for your MongoDB database. The *passwordRegex* is the regex used to validate passwords. The *sessionSecret* is the secret used to sign the session cookie, it can be any string.

---

## Usage

1. Compile the TypeScript files
    ```sh
    npm run build
    ```
2. Start the server
    ```sh
    npm run start
    ```
    Alternatively, you can use `npm run run` to compile and start the server in one command.
2. The server will be running on [port 300](http://127.0.0.1:3000). You can change this in the `server.js` file. 
3. Documentation for the API can be found [here](documentation.md)
