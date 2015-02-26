# Roomies API

### Show a specific User
#### GET '/users/:venmo_id'
#### successful response:
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
#### GET '/houses/:house_id'
#### successful response:
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
#### GET '/users/search'
#### Params: search
#### successful response:
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
#### POST '/users'
#### Params: code (from Venmo OAuth)
#### successful response:
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
    houses: []
  }
}
```

---
### Create a new House
#### POST '/houses'
#### Params: venmo_id (of user creating house), name, password, password_confirmation
#### successful response:
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
### Join an existing House
#### POST '/houses/:house_id/join'
#### Params: venmo_id, password
#### successful response:
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
### Create a new expense
#### POST '/expenses'
#### Params: venmo_id, house_id, note, amount_string
#### successful response:
```JavaScript
{
  expense: {
    id: 1,
    note: "",
    amount: 3.33,
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
    },
    house: {
      id: 1,
      name: ""
    },
    charges: [{
      id: 1,
      venmo_payment_id: "",
      amount: 1.11,
      note: "",
      status: "",
      date_completed: "",
      expense_id: 1,
      user_id: 1,
      house_id: 1
    }]
  }
}
```