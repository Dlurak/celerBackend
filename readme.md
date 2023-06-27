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
        "passwordRegex": "^(?=.*[.,'#+*`´^°!\"§$%&/\\(){}@öäüÖÄÜß²³~])(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{12,}$"
    }
    ```

    The *mongoDbPassword* and *mongoDbUser* are the credentials for your MongoDB database. The *passwordRegex* is the regex used to validate passwords.

4. Create a `.env` file and add this:
    ```env
    JWT_SECRET=
    ```
    The *JWT_SECRET* is the secret used to sign the JSON Web Tokens. You can use any string you want, but it should be long and random.

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
