# API MONGO JWT

## Dev Dependencies
The project needs install nodemon
`npm install -g nodemon`

`npm install --save-dev nodemon`

## Install dependencies

Install dependencies of project.
`npm install`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Routes
METHOD | ENDPOINT | USAGE
--- | --- | ---
POST | `/users/signup` | jwt sign up
POST | `/users/authenticate` | jwt sign in
POST | `/users/forgot-password` | Forgot password
POST | `/users/reset-password` | Reset password


## LINKS
* [Install mongo](https://www.digitalocean.com/community/tutorials/como-instalar-mongodb-en-ubuntu-16-04-es) - Tutorial: Install MongoDB on ubuntu.
