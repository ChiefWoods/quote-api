# Quote API

Quote API for [Random Quote Machine](https://github.com/ChiefWoods/random-quote-machine).

## Usage

Base - `https://quote-api-u0ka.onrender.com`

### Available Collections

- villains
- 48laws
- 33strategies
- htwfaip
- 12rules
- beyondOrder

## Collections

### Get a Collection

`GET /api/collections/:name`

#### Response

```
{
    "fullName": "Villains",
    "quotes": [
        {
            "_id": 1,
            "title": "Thanos",
            "desc": "The hardest choices require the strongest wills."
        },
        {
            "_id": 2,
            "title": "Joker",
            "desc": "In their last moments, people show you who they really are."
        },
        ...
    ],
    "colors": [
        "#0d0e14",
        "#252933",
        ...
    ]
}
```

### Get all Collection Names

`GET /api/collections`

#### Response

```
[
    {
        "name": "villains",
        "fullName": "Villains"
    },
    {
        "name": "48laws",
        "fullName": "48 Laws of Power"
    },
    ...
]
```

### Update Collection

`PUT /api/collections`

Updates a collection or metadata file and creates one if it doesn't exist.

#### Basic Authorization

| Key      | Type   | Description             |
| -------- | ------ | ----------------------- |
| username | String | Used for Authentication |
| password | String | Used for Authentication |

#### Body Data

| Key        | Type   | Description                                                                               |
| ---------- | ------ | ----------------------------------------------------------------------------------------- |
| name       | String | Name of collection                                                                        |
| collection | File   | JSON file with either a 'quotes' or 'metadata' property of an array of quotes or metadata |

#### Response

```
{
    "success": "Collection 'villains' updated."
}
```

## Quotes

### Get Random Quote

`GET /api/quotes/:collection/random`

#### Response

```
{
    "id": 28,
    "name": "White Death",
    "quote": "If you do not control your fate, it will control you."
}
```

### Get Quote by Id

`GET /api/quotes/:collection/:id`

#### Response

```
{
    "_id": 3,
    "title": "Henri Ducard",
    "desc": "You must become more than just a man in the mind of your opponent."
}
```

### Get All Quotes

`GET /api/quotes/:collection`

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
]
```

## Built With

### Languages

- [![JavaScript](https://img.shields.io/badge/Javascript-383936?style=for-the-badge&logo=javascript)](https://js.org/index.html)

### Packages

- [![Express](https://img.shields.io/badge/Express-black?style=for-the-badge&logo=express)](https://expressjs.com/)
- [![dotenv](https://img.shields.io/badge/.Env-black?style=for-the-badge&logo=dotenv)](https://www.dotenv.org/)

### Runtime

- [![Node.js](https://img.shields.io/badge/Node.js-233056?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/en)

### Database

- [![MongoDB](https://img.shields.io/badge/MongoDB-001e2b?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

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
MONGODB_URI=<MONGODB_URI CONNECTION STRING>
MONGODB_DB_NAME=<MONGODB DATABASE NAME>
AUTH_USERNAME=<USERNAME FOR AUTHENTICATING ACCESS>
AUTH_PASSWORD=<PASSWORD FOR AUTHENTICATING ACCESS>
```

4. Start Node server

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
