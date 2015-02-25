# Roomies API

### Show a specific User
### GET '/users/:user_id'
### successful response:
```JavaScript
{
  user: {
    id: 1,
    nickname: "",
    first_name: "",
    last_name: "",
    display_name: "",
    email: "",
    phone: "",
    profile_picture_url: "",
    venmo_id: "",
    houses: [{
      id: 1,
      name: ""
      }]
  }
}
```

---
### Show a specific House
### GET '/houses/:house_id'
### successful response:
```JavaScript
{
  house: {
    id: 1,
    name: "",
    users: [{
      id: 1,
      nickname: "",
      first_name: "",
      last_name: "",
      display_name: "",
      email: "",
      phone: "",
      profile_picture_url: "",
      venmo_id: ""
      }]
  }
}
```

---
### Search existing Users
### GET '/users/search'
### successful response:
```JavaScript
{
  users: [{
    id: 1,
    nickname: "",
    first_name: "",
    last_name: "",
    display_name: "",
    email: "",
    phone: "",
    profile_picture_url: "",
    venmo_id: "",
    houses: [{
      id: 1,
      name: ""
      }]
  }]
}
```

---
### Create a new User
### POST '/users'
### successful response:
```JavaScript
{
  user: {
    id: 1,
    nickname: "",
    first_name: "",
    last_name: "",
    display_name: "",
    email: "",
    phone: "",
    profile_picture_url: "",
    venmo_id: ""
  }
}
```

---
### Create a new House
### POST '/houses'
### successful response:
```JavaScript
{
  house: {
    id: 1,
    name: ""
  }
}
```

---
### Join an existing House
### POST '/houses/:house_id/join'
### successful response:
```JavaScript
{
  house: {
    id: 1,
    name: "",
    users: [{
      id: 1,
      nickname: "",
      first_name: "",
      last_name: "",
      display_name: "",
      email: "",
      phone: "",
      profile_picture_url: "",
      venmo_id: ""
      }]
  }
}
```