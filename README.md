# Quote API

Quote API for [Random Quote Machine](https://github.com/ChiefWoods/random-quote-machine)

## Usage

Base - `https://quote-api-u0ka.onrender.com`

### Available Collections

- villains
- 48laws

### Update Collection

`PUT /api/quotes`

Updates a collection if it exists, and creates one if it doesn't.

#### Body Data

| Key        | Type   | Description                                              |
| ---------- | ------ | -------------------------------------------------------- |
| name       | String | Name of collection                                       |
| collection | File   | JSON file with a 'quotes' property of an array of quotes |

#### Response

```
{
    "success": "Collection 'villains' updated."
}
```

### Get Random Quote

`GET /api/quotes/:name/random`

Gets a random quote.

#### Response

```
{
    "id": 28,
    "name": "White Death",
    "quote": "If you do not control your fate, it will control you."
}
```

### Get Quote by Id

`GET /api/quotes/:name/:id`

Gets a quote by id.

#### Response

```
{
    "id": 1,
    "name": "Thanos",
    "quote": "The hardest choices require the strongest wills."
}
```

### Get All Quotes

`GET /api/quotes/:name`

Gets all quotes from a collection.

#### Response

```
[
    {
        "id": 1,
        "name": "Thanos",
        "quote": "The hardest choices require the strongest wills."
    },
    {
        "id": 2,
        "name": "Joker",
        "quote": "In their last moments, people show you who they really are."
    },
    ...
```

## Built With

### Languages

- [![JavaScript](https://img.shields.io/badge/Javascript-383936?style=for-the-badge&logo=javascript)](https://js.org/index.html)

### Frameworks, Packages and Runtime

- [![Express](https://img.shields.io/badge/Express-black?style=for-the-badge&logo=express)](https://expressjs.com/)
- [![dotenv](https://img.shields.io/badge/.Env-black?style=for-the-badge&logo=dotenv)](https://www.dotenv.org/)
- [![Node.js](https://img.shields.io/badge/Node.js-233056?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/en)

### Database

- [![MongoDB](https://img.shields.io/badge/MongoDB-001e2b?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

### Linters and Formatters

- [![ESLint](https://img.shields.io/badge/eslint-4b32c3?style=for-the-badge&logo=eslint)](https://eslint.org/)
- [![Prettier](https://img.shields.io/badge/prettier-1a2b34?style=for-the-badge&logo=prettier)](https://prettier.io/)

### Tools

- [![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-2c2c32?style=for-the-badge&logo=visual-studio-code&logoColor=007ACC)](https://code.visualstudio.com/)
- [![Postman](https://img.shields.io/badge/Postman-fff?style=for-the-badge&logo=postman)](https://www.postman.com/)

## Getting Started

### Prerequisites

Update your npm package to the latest version.

```
npm install npm@latest -g
```

### Setup

1. Clone the repository

```
git clone https://github.com/ChiefWoods/quote-api.git
```

2. Install all dependencies

```
npm install
```

3. Set environment variables

```
MONGODB_URI=<YOUR MONGODB_URI HERE>
MONGODB_DB_NAME=<NAME OF DATABASE>
```

4. Start Node.js server

```
npm run start
```

## Issues

View the [open issues](https://github.com/ChiefWoods/random-quote-machine/issues) for a full list of proposed features and known bugs.

## Acknowledgements

### Resources

- [Shields.io](https://shields.io/)

### Hosting

- [Render](https://render.com/)

## Contact

[chii.yuen@hotmail.com](mailto:chii.yuen@hotmail.com)
