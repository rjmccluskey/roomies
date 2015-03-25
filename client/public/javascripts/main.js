(function(){
  var RoomiesApp = React.createClass({displayName: "RoomiesApp",
    mergeNewState: function(key, value) {
      var newState = _.extend({}, this.state);
      newState.data[key] = value;
      this.setState(newState);
    },
    loadUserFromServer: function() {
      $.ajax({
        url: "/users",
        dataType: 'json',
        success: function(data) {
          this.mergeNewState("user", data.user);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error("/users", status, err.toString());
        }.bind(this)
      });
    },
    searchUsersFromServer: function(search) {
      var $btn = $("#user-search-btn").button('loading');
      var url = "/search"
      $.ajax({
        url: url,
        dataType: "json",
        data: {search: search},
        success: function(data) {
          if (data.users) {
            this.mergeNewState("searchedUsers", data.users);
          }
          else {
            this.mergeNewState("searchedUsers", []);
          };
          $btn.button('reset');
          if ($('#search-results').attr('aria-expanded') === "false") {
            $("#search-results").dropdown("toggle");
          };
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(url, status, err.toString());
          $btn.button('reset');
        }.bind(this)
      });
    },
    getInitialState: function() {
      return (
        {
          data: {
            user: {
              first_name: "",
              profile_picture_url: "",
              houses: []
            },
            searchedUsers: [
              {
                id: "",
                first_name: "",
                houses: []
              }
            ]
          }
        }
      );
    },
    componentDidMount: function() {
      this.loadUserFromServer();
    },
    render: function() {
      var data = this.state.data;
      var searchedUserModalNodes = data.searchedUsers.map(function(searchedUser) {
        return (
          React.createElement(SearchedUserModal, {searchedUser: searchedUser, user: data.user, onJoinHouse: this.loadUserFromServer, key: searchedUser.id})
        );
      }.bind(this));
      return (
        React.createElement("div", {className: "roomiesApp"}, 
          React.createElement(NewHouseModal, {user: data.user, onCreateHouse: this.loadUserFromServer}), 
          searchedUserModalNodes, 
          React.createElement(NavBar, {user: data.user, searchedUsers: data.searchedUsers, onSearchUsers: this.searchUsersFromServer, onChange: this.loadUserFromServer}), 
          React.createElement(UserHouses, {houses: data.user.houses})
        )
      );
    }
  });

  var NavBar = React.createClass({displayName: "NavBar",
    showNewHouseModal: function(e) {
      e.preventDefault();
      $('#new-house-modal').modal('show');
    },
    render: function() {
      var user = this.props.user;
      var searchedUsers = this.props.searchedUsers
      var searchedUserNodes;
      if (searchedUsers.length === 0) {
        searchedUserNodes = React.createElement("p", {className: "text-danger"}, "User not found!");
      }
      else {
        searchedUserNodes = searchedUsers.map(function(searchedUser) {
          return (
            React.createElement("li", {className: "search-result", key: searchedUser.id}, 
              React.createElement(SearchedUser, {searchedUser: searchedUser, user: user, onJoinHouse: this.props.onChange})
            )
          );
        }.bind(this));
      };
      return (
        React.createElement("nav", {className: "navbar navbar-inverse navbar-fixed-top"}, 
          React.createElement("div", {className: "container"}, 

            React.createElement("div", {className: "navbar-header"}, 
              React.createElement("button", {type: "button", className: "navbar-toggle collapsed", "data-toggle": "collapse", "data-target": "#navbar-collapse"}, 
                React.createElement("span", {className: "sr-only"}, "Toggle navigation"), 
                React.createElement("span", {className: "icon-bar"}), 
                React.createElement("span", {className: "icon-bar"}), 
                React.createElement("span", {className: "icon-bar"})
              ), 
              React.createElement("a", {className: "navbar-brand no-padding", href: "#"}, React.createElement("img", {src: "/images/roomies-logo-inverse.png"}))
            ), 


            React.createElement("div", {className: "collapse navbar-collapse", id: "navbar-collapse"}, 
              React.createElement("ul", {className: "nav navbar-nav"}, 
                React.createElement("li", {className: "dropdown"}, 
                  React.createElement(UserSearchForm, {onUserSearchFormSubmit: this.props.onSearchUsers}), 
                  React.createElement("div", {id: "search-results", "data-target": "#", "data-toggle": "dropdown", "aria-expanded": "false"}), 
                  React.createElement("ul", {className: "dropdown-menu medium-margin-left", role: "menu", "aria-labelledby": "search-results"}, 
                    searchedUserNodes
                  )
                )
              ), 
              React.createElement("ul", {className: "nav navbar-nav navbar-right"}, 
                React.createElement("li", null, 
                  React.createElement("a", {href: "#", onClick: this.showNewHouseModal}, "New house")
                ), 
                React.createElement("li", {className: "dropdown"}, 
                  React.createElement("a", {href: "#", className: "dropdown-toggle user-icon", "data-toggle": "dropdown", role: "button", "aria-expanded": "false"}, 
                    React.createElement("img", {src: user.profile_picture_url}), 
                    React.createElement("span", {className: "caret"})
                  ), 
                  React.createElement("ul", {className: "dropdown-menu", role: "menu"}, 
                    React.createElement("li", null, user.first_name), 
                    React.createElement("li", {className: "divider"}), 
                    React.createElement("li", null, React.createElement("a", {href: "/logout"}, "logout"))
                  )
                )
              )
            )

          )
        )
      );
    }
  });

  var UserSearchForm = React.createClass({displayName: "UserSearchForm",
    handleSubmit: function(e) {
      e.preventDefault();
      var search = this.refs.search.getDOMNode().value.trim();
      if (!search) {
        return;
      };
      this.props.onUserSearchFormSubmit(search);
      this.refs.search.getDOMNode().value = '';
    },
    render: function() {
      return (
        React.createElement("form", {className: "navbar-form navbar-left", role: "search", onSubmit: this.handleSubmit}, 
          React.createElement("div", {className: "form-group"}, 
            React.createElement("input", {type: "text", className: "form-control", placeholder: "Search Users", ref: "search"})
          ), 
          React.createElement("button", {type: "submit", className: "btn btn-default", id: "user-search-btn", "data-loading-text": "Searching..."}, "Search")
        )
      );
    }
  });

  var SearchedUser = React.createClass({displayName: "SearchedUser",
    showModal: function(e) {
      e.preventDefault();
      $("#searched-user-modal" + this.props.searchedUser.id).modal("toggle");
    },
    render: function() {
      var user = this.props.user;
      var searchedUser = this.props.searchedUser;
      return (
        React.createElement("form", {onSubmit: this.showModal}, 
          React.createElement("button", {type: "submit", className: "btn btn-default btn-block", "data-toggle": "modal", "data-target": "searched-user-modal" + searchedUser.id}, 
            React.createElement("img", {className: "pull-left", src: searchedUser.profile_picture_url}), React.createElement("h4", null, searchedUser.first_name)
          )
        )
      );
    }
  });

  var SearchedUserModal = React.createClass({displayName: "SearchedUserModal",
    getInitialState: function() {
      return {recentlyJoinedHouseId: ""};
    },
    handleSuccessfulJoin: function(houseId) {
      this.props.onJoinHouse();
      this.setState({recentlyJoinedHouseId: houseId});
    },
    render: function() {
      var user = this.props.user;
      var searchedUser = this.props.searchedUser;
      var houses = searchedUser.houses;
      var totalHousesMessage = (houses.length === 1) ? "1 house":(houses.length + " houses");
      var houseNodes = houses.map(function(house) {
        var isAMember;
        var joinHouseForm;
        _.each(user.houses, function(loggedInUserHouse){
          if (loggedInUserHouse.id === house.id) {
            isAMember = true;
          }
        });
        if (this.state.recentlyJoinedHouseId === house.id) {
          joinHouseForm = React.createElement("p", {className: "text-success"}, "Successfully joined!")
        }
        else if (isAMember) {
          joinHouseForm = React.createElement("p", null, "You are already a member of this house!");
        }
        else {
          joinHouseForm = React.createElement(JoinHouseForm, {house: house, onSuccessfulJoin: this.handleSuccessfulJoin});
        };
        return (
          React.createElement("div", {className: "house-node", key: house.id}, 
            React.createElement("h4", null, house.name), 
            React.createElement("div", {id: "join-house-form" + house.id}, 
              joinHouseForm
            )
          )
        );
      }.bind(this));
      return (
        React.createElement("div", {className: "modal fade", id: "searched-user-modal" + searchedUser.id, tabIndex: "-1", role: "dialog", "aria-labelledby": "searchedUserModal", "aria-hidden": "true"}, 
          React.createElement("div", {className: "modal-dialog"}, 
            React.createElement("div", {className: "modal-content"}, 
              React.createElement("div", {className: "modal-header"}, 
                React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close"}, React.createElement("span", {"aria-hidden": "true"}, "×")), 
                React.createElement("h3", {className: "modal-title", id: "searchedUserModal"}, searchedUser.display_name)
              ), 
              React.createElement("div", {className: "modal-body"}, 
                React.createElement("div", {id: "searched-user-modal-error"}), 
                React.createElement("h4", null, searchedUser.first_name, " belongs to ", totalHousesMessage, ":"), 
                houseNodes
              )
            )
          )
        )
      );
    }
  });

  var JoinHouseForm = React.createClass({displayName: "JoinHouseForm",
    getInitialState: function() {
      return {error: ""};
    },
    handleSubmit: function(e) {
      e.preventDefault();
      var house = this.props.house;
      var url = "/houses/" + house.id + "/join";
      var $btn = $("#join-house-btn" + house.id).button('loading');
      $.ajax({
        url: url,
        dataType: 'json',
        type: 'POST',
        data: {password: this.refs.password.getDOMNode().value.trim()},
        success: function(data) {
          console.log(data);
          if (data.house) {
            this.props.onSuccessfulJoin(house.id);
          }
          else if (data.error) {
            this.setState({error: data.error});
          }
          $btn.button("reset");
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(url, status, err.toString());
          $btn.button("reset");
        }.bind(this)
      });
      this.refs.password.getDOMNode().value = "";
    },
    render: function() {
      var house = this.props.house;
      var error = this.state.error;
      var hasError;
      var errorNode;
      if (error) {
        hasError = true;
        errorNode = React.createElement("p", {className: "text-danger"}, error);
      }
      var cx = React.addons.classSet;
      var classes = cx({
        "form-group": true,
        "has-error": hasError
      });
      return (
        React.createElement("form", {className: "form-inline", onSubmit: this.handleSubmit}, 
          React.createElement("div", {className: classes}, 
            React.createElement("label", {className: "sr-only", htmlFor: "house-password"}, "Password"), 
            React.createElement("input", {type: "password", className: "form-control", id: "house-password", placeholder: "Enter password", ref: "password"})
          ), 
          React.createElement("button", {type: "submit", id: "join-house-btn" + house.id, className: "btn btn-default"}, "Join house"), 
          errorNode
        )
      );
    }
  });

  var NewHouseModal = React.createClass({displayName: "NewHouseModal",
    resetForm: function() {
      this.refs.name.getDOMNode().value = '';
      this.refs.password.getDOMNode().value = '';
      this.refs.password_confirmation.getDOMNode().value = '';
      this.setState({errors:[]});
    },
    getInitialState: function() {
      return (
        {
          errors: {
            name: [],
            password: [],
            password_confirmation: []
          }
        }
      );
    },
    handleNewHouseCreation: function(e) {
      e.preventDefault();
      var name = this.refs.name.getDOMNode().value.trim();
      var password = this.refs.password.getDOMNode().value.trim();
      var password_confirmation = this.refs.password_confirmation.getDOMNode().value.trim();
      if (!name || !password || !password_confirmation) {
        return;
      }
      var $btn = $('#create-new-house-btn').button('loading');
      var url = "/houses"
      $.ajax({
        url: url,
        dataType: 'json',
        type: 'POST',
        data: {name: name, password: password, password_confirmation: password_confirmation},
        success: function(data) {
          if (data.errors) {
            this.setState(data);
          }
          else {
            this.props.onCreateHouse();
            $('#new-house-modal').modal('hide');
            this.resetForm();
          };
          $btn.button("reset");
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(url, status, err.toString());
          $btn.button("reset");
        }.bind(this)
      });
    },
    render: function() {
      var user = this.props.user;
      var errors = this.state.errors;
      var errorCount = 0;
      var errorNodes = _.mapObject(errors, function(val, key) {
        return (
          val.map(function(errorMsg) {
            errorCount ++
            return React.createElement("p", {className: "text-danger", key: errorCount}, errorMsg);
          })
        );
      });
      var nameErrorNodes = errorNodes.name;
      var passwordErrorNodes = errorNodes.password;
      var passwordConfirmationErrorNodes = errorNodes.password_confirmation;

      var hasErrors = function(errorNodes) {
        if (errorNodes && errorNodes.length > 0) {
          return true;
        };
      };
      var cx = React.addons.classSet;
      var nameClasses = cx({
        "form-group": true,
        "has-error": hasErrors(nameErrorNodes)
      });
      var passwordClasses = cx({
        "form-group": true,
        "has-error": hasErrors(passwordErrorNodes)
      });
      var passwordConfirmationClasses = cx({
        "form-group": true,
        "has-error": hasErrors(passwordConfirmationErrorNodes)
      });

      return (
        React.createElement("div", {className: "modal fade", id: "new-house-modal", tabIndex: "-1", role: "dialog", "aria-labelledby": "new-house-modal-label", "aria-hidden": "true"}, 
          React.createElement("div", {className: "modal-dialog"}, 
            React.createElement("div", {className: "modal-content"}, 
              React.createElement("div", {className: "modal-header"}, 
                React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close"}, React.createElement("span", {"aria-hidden": "true", onClick: this.resetForm}, "×")), 
                React.createElement("h4", {className: "modal-title", id: "new-house-modal-label"}, "Create a new house")
              ), 
              React.createElement("div", {className: "modal-body"}, 
                React.createElement("div", {className: nameClasses}, 
                  React.createElement("label", {htmlFor: "new-house-name-input"}, "Name your house:"), 
                  React.createElement("input", {type: "text", className: "form-control", id: "new-house-name-input", ref: "name"}), 
                  nameErrorNodes
                ), 
                React.createElement("div", {className: passwordClasses}, 
                  React.createElement("label", {htmlFor: "new-house-password-input"}, "Choose a password:"), 
                  React.createElement("input", {type: "password", className: "form-control", id: "new-house-password-input", ref: "password"}), 
                  passwordErrorNodes
                ), 
                React.createElement("div", {className: passwordConfirmationClasses}, 
                  React.createElement("label", {htmlFor: "new-house-password-confirmation-input"}, "Confirm your password:"), 
                  React.createElement("input", {type: "password", className: "form-control", id: "new-house-password-confirmation-input", ref: "password_confirmation"}), 
                  passwordConfirmationErrorNodes
                )
              ), 
              React.createElement("div", {className: "modal-footer"}, 
                React.createElement("button", {type: "button", className: "btn btn-default", "data-dismiss": "modal", onClick: this.resetForm}, "Close"), 
                React.createElement("button", {type: "button", onClick: this.handleNewHouseCreation, className: "btn btn-primary", id: "create-new-house-btn", "data-loading-text": "Creating..."}, "Create house")
              )
            )
          )
        )
      );
    }
  });


  var UserHouses = React.createClass({displayName: "UserHouses",
    render: function() {
      var houseNodes = this.props.houses.map(function(house) {
        return (
          React.createElement(House, {house: house, key: house.id})
        );
      });
      if (houseNodes.length === 0) {
        return (
          React.createElement("div", {className: "container"}, 
            React.createElement("h1", null, "You don't belong to any houses yet!")
          )
        );
      }
      else {
        return (
          React.createElement("div", {className: "userHouses"}, 
            houseNodes
          )
        );
      }
    }
  });

  var House = React.createClass({displayName: "House",
    loadHouseFromServer: function() {
      var url = "/houses/" + this.props.house.id;
      $.ajax({
        url: "/houses/" + this.props.house.id,
        dataType: 'json',
        success: function(data) {
          this.setState(data);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(url, status, err.toString());
        }.bind(this)
      });
    },
    loadExpensesFromServer: function() {
      var url = "/houses/" + this.props.house.id + "/expenses";
      $.ajax({
        url: url,
        dataType: 'json',
        success: function(data) {
          this.setState(data);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(url, status, err.toString());
        }.bind(this)
      });
    },
    handleExpenseSubmit: function(expense) {
      var houseId = this.props.house.id;
      var amount = expense.amount;
      var description = expense.description;
      var $btn = $("#expense-form-button" + houseId).button('loading');

      $.ajax({
        url: "/expenses",
        dataType: 'json',
        type: 'POST',
        data: {house_id: houseId, amount_string: amount, note: description},
        success: function(data) {
          this.loadExpensesFromServer();
          $btn.button("reset");
        }.bind(this),
        error: function(xhr, status, err) {
          console.error("/expenses", status, err.toString());
          $btn.button("reset");
        }.bind(this)
      });
    },
    getInitialState: function() {
      return(
        {
          house: {
            users: []
          },
          expenses: [
            {
              id: "",
              amount: "",
              note: "",
              created_at: "",
              user: {profile_picture_url: ""},
              charges: [
                {
                  id: "",
                  amount: "",
                  user: {profile_picture_url: ""},
                  date_completed: ""
                }
              ]
            }
          ]
        }
      );
    },
    componentDidMount: function() {
      this.loadHouseFromServer();
    },
    render: function() {
      var house = this.props.house;
      var users = this.state.house.users;
      var expenses = this.state.expenses;

      var userNodes = users.map(function(user) {
        return (
          React.createElement("span", {title: user.first_name, key: user.id}, 
            React.createElement("img", {src: user.profile_picture_url})
          )
        );
      });
      return (
        React.createElement("div", {className: "container"}, 
          React.createElement("div", {className: "jumbotron"}, 
            React.createElement("div", {className: "row"}, 
              React.createElement("div", {className: "col-sm-5"}, 
                React.createElement("h2", null, house.name, " ", React.createElement("span", null, userNodes)), 
                React.createElement(ExpenseForm, {houseId: house.id, onExpenseSubmit: this.handleExpenseSubmit})
              ), 
              React.createElement("div", {className: "col-sm-7"}, 
                React.createElement(HouseExpenses, {expenses: expenses, loadExpensesFromServer: this.loadExpensesFromServer})
              )
            )
          )
        )
      );
    }
  });

  var HouseExpenses = React.createClass({displayName: "HouseExpenses",
    componentDidMount: function() {
      this.props.loadExpensesFromServer();
    },
    render: function() {
      var expenses = this.props.expenses;
      var expenseNodes = expenses.map(function(expense) {
        return (
          React.createElement("div", {className: "media list-group-item", href: "#", key: expense.id}, 
            React.createElement("div", {className: "media-left"}, 
              React.createElement("img", {className: "media-object", src: expense.user.profile_picture_url})
            ), 
            React.createElement("div", {className: "media-body"}, 
              React.createElement("p", {className: "media-heading "}, React.createElement("small", null, "added $", expense.amount, " for ", expense.note)), 
              React.createElement("p", null, React.createElement("small", null, React.createElement("small", null, Dateify.sayDays(expense.created_at) + " at " + Dateify.sayTime(expense.created_at))))
            ), 
            React.createElement(ExpenseCharges, {expense: expense})
          )
        );
      });
      if (expenses.length > 0) {
        return (
          React.createElement("div", {className: "list-group house-expenses well"}, 
            expenseNodes
          )
        );
      }
      else {
        return (
          React.createElement("div", {className: "list-group house-expenses well"}, 
            React.createElement("h3", null, "No expenses have been added yet!")
          )
        );
      };
    }
  });

  var ExpenseCharges = React.createClass({displayName: "ExpenseCharges",
    render: function() {
      var expense = this.props.expense;
      var expenseId = "expense-charges" + expense.id;
      var numPending = expense.charges.length;
      var expenseStatus = "btn-warning"

      _.each(expense.charges, function(charge) {
        if (charge.date_completed) {
          numPending--;
        };
      });

      if (numPending === 0) {
        expenseStatus = "btn-success";
      };

      var chargeNodes = expense.charges.map(function(charge) {
        var message;
        var chargeStatus;
        var glyphicon;
        var date_completed = charge.date_completed;
        if (date_completed) {
          message = "paid $" + charge.amount + " " + Dateify.sayDays(date_completed) + " at " + Dateify.sayTime(date_completed);
          chargeStatus = "bg-success";
          glyphicon = "glyphicon glyphicon-ok-circle"
        }
        else {
          message = "owes $" + charge.amount;
          chargeStatus = "bg-warning"
        }
        return (
          React.createElement("div", {className: "list-group-item well no-padding group-tight", key: charge.id}, 
            React.createElement("div", {className: chargeStatus}, 
              React.createElement("img", {src: charge.user.profile_picture_url}), 
              React.createElement("span", null, " ", message), React.createElement("span", {className: "pull-right " + glyphicon})
            )
          )
        );
      });
      return (
        React.createElement("div", {className: "expense-charges"}, 
          React.createElement("a", {className: "btn " + expenseStatus, "data-toggle": "collapse", href: "#" + expenseId, "aria-expanded": "false", "aria-controls": "collapseExample"}, 
            React.createElement("span", {className: "caret"}), " Charges ", React.createElement("span", {className: "badge"}, numPending, " pending")
          ), 
          React.createElement("div", {className: "list-group collapse", id: expenseId}, 
            chargeNodes
          )
        )
      );
    }
  });

  var ExpenseForm = React.createClass({displayName: "ExpenseForm",
    handleSubmit: function(e) {
      e.preventDefault();
      var amount = this.refs.amount.getDOMNode().value.trim();
      var description = this.refs.description.getDOMNode().value.trim();
      if (!amount || !description) {
        return;
      }
      this.props.onExpenseSubmit({amount: amount, description: description});
      this.refs.amount.getDOMNode().value = '';
      this.refs.description.getDOMNode().value = '';
    },
    render: function() {
      var houseId = this.props.houseId;
      return (
        React.createElement("form", {className: "expense-form", onSubmit: this.handleSubmit}, 
          React.createElement("div", {className: "form-group group-tight"}, 
            React.createElement("label", {className: "sr-only", htmlFor: "inputAmount" + houseId}, "Amount (in dollars)"), 
            React.createElement("div", {className: "input-group"}, 
              React.createElement("div", {className: "input-group-addon"}, "$"), 
              React.createElement("input", {type: "text", className: "form-control", id: "inputAmount" + houseId, placeholder: "Amount", ref: "amount"})
            )
          ), 
          React.createElement("div", {className: "form-group group-tight"}, 
            React.createElement("label", {className: "sr-only", htmlFor: "inputDescription" + houseId}, "Expense description"), 
            React.createElement("textarea", {className: "form-control", id: "inputDescription" + houseId, placeholder: "Add a description", rows: "3", ref: "description"})
          ), 
          React.createElement("div", {className: "form-group group-tight"}, 
            React.createElement("button", {type: "submit", className: "btn btn-primary btn-block", id: "expense-form-button" + houseId, "data-loading-text": "Adding..."}, "Add Expense")
          )
        )
      );
    }
  });

  React.render(
    React.createElement(RoomiesApp, null),
    document.getElementById('content')
  );
}());