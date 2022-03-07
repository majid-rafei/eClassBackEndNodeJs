# EClass Back-End with Node.js and TypeScript

This is the back-end project for E-class simple written by Node.js and Typescript.

## Steps into project
The implementation of the project is decided into the following sub-tasks:
* Step 1: Initialization:
    * Sub-task 1: Initializing npm and installing required packages, Creating tsconfig.json file
    * Sub-task 2: Creating docker-compose.yml file to create a container for postgresql database
    * Sub-task 3: Creating src folder for storing the project modules
* Step 2: Initializing Common module: to store common codes
    * Sub-task 1: Creating common Route file to use with other modules
    * Sub-task 2: Creating directories like interfaces, services, etc. to add common files created during project development.
* Step 3: Initializing and preparing database connection
    * Sub-task 1: Initializing and preparing codes for database connection using Prisma package.
* Step 4: Developing E-Class module
    * Sub-task 1: Creating directories for controllers, services, daos, middlewares, dto, etc.
    * Sub-task 2: Creating Route file for eclass module and implementing needed routes and initializing app.ts
    * Sub-task 3: Developing getTableFields endpoint: this endpoint gives fields of e-class tables
    * Sub-task 4: Developing getStructuredData endpoint: this endpoint gives structured data of simple e-class tables, filters for searching E-class tables are applied on this endpoint
* Step 5: Developing user module
    * Sub-task 1: Creating endpoints for create, list, update, and delete users
    * Sub-task 2: Developing user authentication