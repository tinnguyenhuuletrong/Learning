# Sample

## 1. Multiple query + alias

```gql
{
  bookWithId1: bookById(id: 1) {
    title
    author {
      name
    }
  }

  bookWithId2: bookById(id: 2) {
    title
    author {
      name
    }
  }

  authors {
    id
    name
  }
}
```

## 2. Lookup Authors -> Books

```gql
{
  authors {
    name
    books {
      title
    }
  }
}
```
