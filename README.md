# Quote API

Quote API for [Random Quote Machine](https://github.com/ChiefWoods/random-quote-machine).

## Usage

Base - `https://quote-api-u0ka.onrender.com/api`

### Available Collections

- Villains
- 48 Laws of Power
- 33 Strategies of War
- How to Win Friends and Influence People
- 12 Rules for Life
- Beyond Order

## Auth

Non-GET routes require basic auth.

| Key      | Type   |
| -------- | ------ |
| username | string |
| password | string |

## Initialize Database

`POST /init`

#### Response

```
Database initialized.
```

## Collections

### Get a collection and all quotes in it

`GET /collections/:id`

#### Response

```
{
  "id": 1,
  "name": "Villains",
  "colors": [
    "#0d0e14",
    "#252933",
    "#404556",
    ...
  ],
  "quotes": [
    {
      "id": 1,
      "main": "The hardest choices require the strongest wills.",
      "sub": "Thanos",
      "collection_id": 1
    },
    ...
  ]
}
```

### Get all collection names

`GET /collections`

#### Response

```
[
  "12 Rules for Life",
  "33 Strategies of War",
  "48 Laws of Power",
  ...
]
```

### Add a new collection

`POST /collections`

#### Multipart Form

| Key        | Type | Description                                                                                                                                                            |
| ---------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| collection | file | JSON file with fields 'name' of string, 'colors' of array of strings in RGB (eg: #771747), and 'quotes' of array of quotes, each with fields 'main' and optional 'sub' |

#### Response

```
{
  "id": 1,
  "name": "Villains",
  "colors": [
    "#0d0e14",
    "#252933",
    "#404556",
    ...
  ],
  "quotes": [
    {
      "id": 1,
      "main": "The hardest choices require the strongest wills.",
      "sub": "Thanos",
      "collection_id": 1
    },
    ...
  ]
}
```

### Update a collection

`PUT /collections/:id`

#### Body

| Key    | Type     | Description                           |
| ------ | -------- | ------------------------------------- |
| name   | string   | Collection name                       |
| colors | string[] | Array of strings in RGB (eg: #771747) |

#### Response

```
{
  "id": 1,
  "name": "Villains",
  "colors": [
    "#0d0e14",
    "#252933",
    "#404556",
    ...
  ]
}
```

### Delete a collection

`DELETE /collections:id`

#### Response

```
Collection '1' deleted.
```

## Quotes

### Get a quote

`GET /quotes/:id`

#### Response

```
{
  "id": 1,
  "main": "The hardest choices require the strongest wills.",
  "sub": "Thanos",
  "collection_id": 1
}
```

### Add new quotes

`POST /quotes/`

#### Body

| Key          | Type                               | Description   |
| ------------ | ---------------------------------- | ------------- |
| collectionId | number                             | Collection id |
| quotes       | <{ main: string, sub?: string }>[] | New quotes    |

#### Response

```
[
  {
    "id": 2,
    "main": "In their last moments, people show you who they really are.",
    "sub": "Joker",
    "collection_id": 1
  },
  ...
]
```

### Delete a quote

`DELETE /quotes/:id`

#### Response

```
Quote '1' deleted.
```

## Built With

### Languages

- [![TypeScript](https://img.shields.io/badge/TypeScript-white?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

### Packages

- [![Express](https://img.shields.io/badge/Express-black?style=for-the-badge&logo=express)](https://expressjs.com/)

### Runtime

- [![Bun](https://img.shields.io/badge/Bun-000?style=for-the-badge&logo=bun)](https://bun.sh/)

### Database

- [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-212121?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

## Getting Started

### Prerequisites

Update your Bun toolkit to the latest version.

```bash
bun upgrade
```

### Setup

1. Clone the repository

```bash
git clone https://github.com/ChiefWoods/quote-api.git
```

2. Install all dependencies

```bash
bun install
```

3. Set environment variables

```bash
DATABASE_URL=
AUTH_USERNAME=
AUTH_PASSWORD=
```

4. Start PostgreSQL

```bash
sudo systemctl start postgresql
```

5. Start Express server

```bash
bun run dev
```

## Issues

View the [open issues](https://github.com/ChiefWoods/random-quote-machine/issues) for a full list of proposed features and known bugs.

## Acknowledgements

### Resources

- [Shields.io](https://shields.io/)

### Hosting

- [Render](https://render.com/)
- [Supabase](https://supabase.com/)

## Contact

[chii.yuen@hotmail.com](mailto:chii.yuen@hotmail.com)
