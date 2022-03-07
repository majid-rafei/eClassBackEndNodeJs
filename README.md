~~# EClass Back-End with Node.js and TypeScript

This is the back-end project for E-class simple written by Node.js and Typescript.

**Requirements**
* npm
* docker

In order to run project, please follow these stepsL
* Download this git repository
* Run: `npm install`
* 

## Steps into the back-end project
The implementation of the project is decided into the following sub-tasks:
* Step 1: Initialization:
    * Sub-task 1-1: Initializing npm, installing required packages, and creating tsconfig.json file
    * Sub-task 1-2: Creating docker-compose.yml file to create a container for postgresql database
    * Sub-task 1-3: Creating src folder for storing the project modules
* Step 2: Initializing Common module: to store common codes
    * Sub-task 2-1: Creating common Route file to use with other modules
    * Sub-task 2-2: Creating directories like interfaces, services, etc. to add common files created during project development.
* Step 3: Initializing and preparing database connection
    * Sub-task 3-1: Initializing and preparing codes for database connection using Prisma package.
    * Sub-task 3-2: Importing E-class csv files into database
* Step 4: Developing E-Class module
    * Sub-task 4-1: Creating directories for controllers, services, daos, middlewares, dto, etc.
    * Sub-task 4-2: Creating Route file for eclass module and implementing needed routes and initializing app.ts
    * Sub-task 4-3: Developing getTableFields endpoint: this endpoint gives fields of e-class tables
    * Sub-task 4-4: Developing getStructuredData endpoint: this endpoint gives structured data of simple e-class tables, filters for searching E-class tables are applied on this endpoint
* Step 5: Developing user module
    * Sub-task 5-1: Creating endpoints for creating, listing, updating, and deleting users
    * Sub-task 5-2: Developing user authentication

## Step 1: Initialization
In this step, all initializations to have the base server using Node.js and typescript will be done.

### Sub-task 1-1: Initializing npm, installing required packages, and creating tsconfig.json file
#### Initializing npm
For this purpose, run the following command:

`npm init`

This will create a *package.json* file, which is npm entry file for package management.

Next, we will install npm packages that are needed for this project.
Let's execute the following command:

`npm install express debug winston express-winston cors express-validator`

and then the following:

`npm install --save-dev @types/cors @types/express @types/debug source-map-support eslint typescript prisma pm2`

We create the tsconfig.json file to configure typescript. The tsconfig.json file contains the following codes:

```json
{
    "compilerOptions": {
        "target": "ES2016",
        "module": "commonjs",
        "outDir": "./dist",
        "strict": true,
        "esModuleInterop": true,
        "inlineSourceMap": true
    }
}
```