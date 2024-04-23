# Cats Api

## Description

The above project was implemented using the nestjs framework. There are 2 main ways to get started with it

- Yarn/NPM
- Docker

## Working with Yarn

### Creating a .env file

Start by creating a .env file, a good example can be found in the .env.example file provided in the root folder. It provides a good overview and description of the required variables

### Installation

```bash
$ yarn install
```

### Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### Test

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

## Working with Docker

Start by filling out the required enviromnetal variables in the docker-compose.yml file in the root folder of the application, you can also look at the  .env.example file for further guidiance on the what each individual variable means.

### Build and Run

```bash
# inital build
$ docker-compose up --build


# subsequent docker compose
$ docker-compose up 
```

Both of these methods serve the application over https://localhost:5001

Remote URL: https://cats-api-fikky-867267d38a0e.herokuapp.com
Postman Documentation: https://documenter.getpostman.com/view/778610/2sA3Bq5X1T

## Additional Information

On initial execution of the application, an admin User will be generated which can be used to initiate the initial admin functionalities (including creating new admins). The default login credentials are

- email: default@admin.com
- password: password

You can update this password using the Change Password Endpoint After a successful login

# Technologies Used

- Database: Postgres
- ORM: TypeOrm
- Data Validation: Class Validator
- Authorization & Authentication: PassportJS & JWT
- Tests: Jest

## License

Nest is [MIT licensed](LICENSE).
