# EClass Back-End with Node.js and TypeScript

This is the back-end project for E-class simple written by Node.js and Typescript.

**Requirements**
* npm
* docker

In order to run project, please follow these stepsL
* Download this git repository
* Run: `npm install`
* Run: `sudo docker-compose up -d`

## Steps into the back-end project
The implementation of the project is decided into the following sub-tasks:
* Step 1: Initialization:
    * Sub-task 1-1: Initializing npm, installing required packages, and creating tsconfig.json file
    * Sub-task 1-2: Creating docker-compose.yml file to create a container for postgresql database
    * Sub-task 1-3: Creating src folder for storing the project modules
* Step 2: Initializing Common module: to store common codes
    * Sub-task 2-1: Creating common Route file to use with other modules
    * Sub-task 2-2: Creating directories like interfaces, services, etc. to add common files created during project development
* Step 3: Initializing and preparing database connection
    * Sub-task 3-1: Initializing and preparing codes for database connection using Prisma package.
* Step 4: Developing E-Class module
    * Sub-task 4-1: Creating directories for controllers, services, daos, middlewares, etc.
    * Sub-task 4-2: Creating Route file for eclass module and implementing needed routes and initializing app.ts
    * Sub-task 4-3: Developing initializeDatabase endpoint: importing E-class csv files into database
    * Sub-task 4-4: Developing getTableFields endpoint: this endpoint gives fields of e-class tables
    * Sub-task 4-5: Developing getStructuredData endpoint: this endpoint gives structured data of simple e-class tables, filters for searching E-class tables are applied on this endpoint
    * Sub-task 4-6: Developing importCsvFiles endpoint: using this endpoint, user can import CSV files into database
* Step 5: Developing user module
    * Sub-task 5-1: Creating endpoints for creating, listing, updating, and deleting users
    * Sub-task 5-2: Developing user authentication

## Step 1: Initialization
In this step, all initializations to have the base server using Node.js and typescript will be done.

### Sub-task 1-1: Initializing npm, installing required packages, and creating tsconfig.json file
#### Initializing npm
For this purpose, run the following command:

* `npm init`

This will create a *package.json* file, which is npm entry file for package management.

#### Installing required packages

Next, we will install npm packages that are needed for this project.
Let's execute the following command:

* `npm install express debug winston express-winston cors express-validator`

and then the following:

* `npm install --save-dev @types/cors @types/express @types/debug source-map-support eslint typescript prisma pm2`

#### Creating tsconfig.json file

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

### Sub-task 1-2: Creating docker-compose.yml file to create a container for postgresql database

Docker is used to create an isolated and virtual environment for the project. Docker needs a docker-compose.yml file for the services of the project.

Creating database and the connection to it are the first steps to go deep into the application.
Decision on choosing the type of database (relational with schema or non-relational with no-schema) and the database are done based on the application.
For applications with big and relational data, Postgresql database is offered, which is a relational database.
In this project we use Postgresql because we have relational tables which are utilized for classifications
and contain financial, units, and many other data types.

To install and run a Postgresql database using Docker, the docker-compose.yml file is used.
In this project we create a service which contains necessary environment for postgresql database.

docker-compose.yml file contains the following codes:

```yaml
version: '3.3'
services:
    postgres:
        image: postgres:13.5
        restart: always
        hostname: postgres
        container_name: postgres
        environment:
            POSTGRES_USER: postgres
            POSTGRES_PASSWORD: postgres_123
            POSTGRES_DB: dundts
        volumes:
            - postgres:/var/lib/postgresql/data
        ports:
            - '15432:5432'
volumes:
    postgres:
```

To create the docker container, the following command is executed:

* `sudo docker-compose up -d`

Docker needs root or sudo access to the working system.

After this command, the postgresql database is initialized and ready to use at `localhost:15432`.

### Sub-task 1-3: Creating src folder for storing the project modules

A directory named `src` is created which is intended to maintain project files and source codes. 
All modules are created in this folder.

## Step 2: Initializing Common module: to store common codes

The common module is the first and base module and shares codes with other modules to prevent rewriting common codes.

### Sub-task 2-1: Creating common Route file to use with other modules

One of the common files is `common.routes.config.ts`, which is for configuring routes of the application and other modules are inherited from it.

### Sub-task 2-2: Creating directories like interfaces, services, etc. to add common files created during project development

Directories like interfaces and services are the most common ones shared between modules. 

## Step 3: Initializing and preparing database connection
In this section, **Prisma** package is introduced as the manager of the database connections.
Then a service will be created to import CSV files into the database using Prisma models.

### Sub-task 3-1: Initializing and preparing codes for database connection using Prisma package.
**Prisma** is selected as the node package for manipulating database queries and models.
Prisma is a new generation database connection handler with an emphasis on checking run-time data types.
This feature of Prisma, distinguishes it from other database management packages.

To use Prisma, a schema file should be defined.
This file is located inside prisma folder at the root directory of the project.
Hence, we create a folder named *prisma* in the project and inside it create a file named `schema.prisma`.
This file holds some database configurations and also models which are related to the database tables.
If models are defined, then there is a migration command which is used to create or modify the tables.

* `npx prisma migrate dev --name init`

Also, there is a possibility to create models in prisma file using prepared tables.
This is a two-way relation between model and table.

To use Prisma as the client, the following command is executed:

* `npm install @prisma/client`

Prisma needs .env file in which database *dns* is stored.
This file at located in the root of the project.

The best practice to connect to the database is to create a single instance of database connection
so that no other parallel connection can make insertion or update over table rows.
Therefore, the single-tone pattern is selected to develop the Prisma connection.
We place this service into the services folder of the common module.

In order to use this service in other files, it should be imported as the following:

```ts
import PrismaService from '/src/common/services/prisma.service';
const prisma = PrismaService.getPrisma();
```

and then the following code to make a query:

```ts
prisma.TABLE_NAME.ACTION({...})
```

## Step 4: Developing E-Class module

In this part, the E-Class module is developed and as a result, some endpoints are available to use, including:
* initializeDatabase
* getTableFields
* getStructuredData
* importCsvFiles

### Sub-task 4-1: Creating directories for controllers, services, daos, middlewares, etc.

A most common structure for each module contains controllers, services, daos, and middlewares directories which are respectively 
* (controllers) for handling endpoints and sending request params to the service for further processes,
* (services) for processing requests according to the provided params and calling daos if needed,
* (daos) for fetching from, inserting into, and updating the database,
* (middlewares) for pre-processing requests before getting into controllers.
We will make these directories for further development.

### Sub-task 4-2: Creating Route file for eclass module and implementing needed routes and initializing app.ts

The first route to implement is the database initialization route.
For that purpose, we create a file named *app.ts* to handle incoming requests and return the response to the caller.
This *app.ts* file is the entry point of the application and each request passes through it.
In *app.ts* routes are gathered into an array (routes) by adding config file of each module and each time a request arrives,
the corresponding module will handle the request for further processes.
In *app.ts* requests are logged and the server is started at the given port.

Middlewares are called in routes config file of module before sending the params to the controller.
Controller is the endpoint of each request and the final response of the request is created there.

Here we implement required and essential codes to handle a request by Node.js and *app.ts* file.

For handling response codes, a new package is installed:
* `npm i http-status-codes`
  This package gives http response codes.

At this point, if we call `/eclass/initializeDatabase`
we will get `The initializeDatabase endpoint is OK` response.

At the next sub-task, we will implement services needed for initializeDatabase endpoint.