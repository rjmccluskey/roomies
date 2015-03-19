(function(){
  var RoomiesApp = React.createClass({
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
          this.mergeNewState("searchedUsers", data.users);
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
    sendErrorNotification: function(error) {
      var node = error.node;
      var message = error.message;
      this.mergeNewState("error", error.message);
      // node.append($("#error-alert"));
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
      console.log(data)
      return (
        <div className="roomiesApp">
          <NavBar user={data.user} searchedUsers={data.searchedUsers} onSearchUsers={this.searchUsersFromServer} onChange={this.loadUserFromServer} />
          <UserHouses houses={data.user.houses} />
        </div>
      );
    }
  });

  var NavBar = React.createClass({
    showNewHouseModal: function(e) {
      e.preventDefault();
      $('#new-house-modal').modal('show');
    },
    render: function() {
      var user = this.props.user;
      var error = this.props.error;
      var searchedUserNodes;
      if (error) {
        searchedUserNodes = error;
      }
      else {
        searchedUserNodes = this.props.searchedUsers.map(function(searchedUser) {
          return (
            <li className="search-result" key={searchedUser.id}>
              <SearchedUser searchedUser={searchedUser} user={user} onJoinHouse={this.props.onChange} />
            </li>
          );
        }.bind(this));
      };
      return (
        <nav className="navbar navbar-inverse navbar-fixed-top" >
          <div className="container">

            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand no-padding" href="#"><img src="/images/roomies-logo-inverse.png" /></a>
            </div>


            <div className="collapse navbar-collapse" id="navbar-collapse">
              <ul className="nav navbar-nav">
                <li className="dropdown">
                  <UserSearchForm onUserSearchFormSubmit={this.props.onSearchUsers}/>
                  <div id="search-results" data-target="#" data-toggle="dropdown" aria-expanded="false" />
                  <ul className="dropdown-menu medium-margin-left" role="menu" aria-labelledby="search-results">
                    {searchedUserNodes}
                  </ul>
                </li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <a href="#" onClick={this.showNewHouseModal}>New house</a>
                  <NewHouseModal user={user} onCreateHouse={this.props.onChange} />
                </li>
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle user-icon" data-toggle="dropdown" role="button" aria-expanded="false">
                    <img src={user.profile_picture_url} />
                    <span className="caret"></span>
                  </a>
                  <ul className="dropdown-menu" role="menu">
                    <li>{user.first_name}</li>
                    <li className="divider"></li>
                    <li><a href="/logout">logout</a></li>
                  </ul>
                </li>
              </ul>
            </div>

          </div>
        </nav>
      );
    }
  });

  var UserSearchForm = React.createClass({
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
        <form className="navbar-form navbar-left" role="search" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input type="text" className="form-control" placeholder="Search Users" ref="search" />
          </div>
          <button type="submit" className="btn btn-default" id="user-search-btn" data-loading-text="Searching...">Search</button>
        </form>
      );
    }
  });

  var SearchedUser = React.createClass({
    showModal: function(e) {
      e.preventDefault();
      $("#searched-user-modal" + this.props.searchedUser.id).modal("toggle");
    },
    render: function() {
      var user = this.props.user;
      var searchedUser = this.props.searchedUser;
      return (
        <div className="searched-user" >
          <form onSubmit={this.showModal}>
            <button type="submit" className="btn btn-default btn-block" data-toggle="modal" data-target={"searched-user-modal" + searchedUser.id}>
              <img className="pull-left" src={searchedUser.profile_picture_url} /><h4>{searchedUser.first_name}</h4>
            </button>
          </form>
          <SearchedUserModal searchedUser={searchedUser} user={user} onJoinHouse={this.props.onJoinHouse} />
        </div>
      );
    }
  });

  var SearchedUserModal = React.createClass({
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
          joinHouseForm = <p className="text-success">Successfully joined!</p>
        }
        else if (isAMember) {
          joinHouseForm = <p>You are already a member of this house!</p>;
        }
        else {
          joinHouseForm = <JoinHouseForm house={house} onSuccessfulJoin={this.handleSuccessfulJoin} />;
        };
        return (
          <div className="house-node" key={house.id}>
            <h4>{house.name}</h4>
            <div id={"join-house-form" + house.id}>
              {joinHouseForm}
            </div>
          </div>
        );
      }.bind(this));
      return (
        <div className="modal fade" id={"searched-user-modal" + searchedUser.id} tabIndex="-1" role="dialog" aria-labelledby="searchedUserModal" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h3 className="modal-title" id="searchedUserModal">{searchedUser.display_name}</h3>
              </div>
              <div className="modal-body">
                <div id="searched-user-modal-error" />
                <h4>{searchedUser.first_name} belongs to {totalHousesMessage}:</h4>
                {houseNodes}
              </div>
            </div>
          </div>
        </div>
      );
    }
  });

  var NewHouseModal = React.createClass({
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
          console.log(data);
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
            return <p className="text-danger" key={errorCount}>{errorMsg}</p>;
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
        <div className="modal fade" id="new-house-modal" tabIndex="-1" role="dialog" aria-labelledby="new-house-modal-label" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" onClick={this.resetForm}>&times;</span></button>
                <h4 className="modal-title" id="new-house-modal-label">Create a new house</h4>
              </div>
              <div className="modal-body">
                <div className={nameClasses}>
                  <label htmlFor="new-house-name-input">Name your house:</label>
                  <input type="text" className="form-control" id="new-house-name-input" ref="name" />
                  {nameErrorNodes}
                </div>
                <div className={passwordClasses}>
                  <label htmlFor="new-house-password-input">Choose a password:</label>
                  <input type="password" className="form-control" id="new-house-password-input" ref="password" />
                  {passwordErrorNodes}
                </div>
                <div className={passwordConfirmationClasses}>
                  <label htmlFor="new-house-password-confirmation-input">Confirm your password:</label>
                  <input type="password" className="form-control" id="new-house-password-confirmation-input" ref="password_confirmation" />
                  {passwordConfirmationErrorNodes}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.resetForm}>Close</button>
                <button type="button" onClick={this.handleNewHouseCreation} className="btn btn-primary" id="create-new-house-btn" data-loading-text="Creating...">Create house</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  });

  var JoinHouseForm = React.createClass({
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
          if (data.house) {
            this.props.onSuccessfulJoin(house.id);
            console.log("successfuly joined " + data.house.name + "!");
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
        errorNode = <p className="text-danger">{error}</p>;
      }
      var cx = React.addons.classSet;
      var classes = cx({
        "form-group": true,
        "has-error": hasError
      });
      return (
        <form className="form-inline" onSubmit={this.handleSubmit}>
          <div className={classes}>
            <label className="sr-only" htmlFor="house-password">Password</label>
            <input type="password" className="form-control" id="house-password" placeholder="Enter password" ref="password" />
          </div>
          <button type="submit" id={"join-house-btn" + house.id} className="btn btn-default">Join house</button>
          {errorNode}
        </form>
      );
    }
  });

  var UserHouses = React.createClass({
    render: function() {
      var houseNodes = this.props.houses.map(function(house) {
        return (
          <House house={house} key={house.id} />
        );
      });
      if (houseNodes.length === 0) {
        return (
          <div className="container">
            <h1>You don't belong to any houses yet!</h1>
          </div>
        );
      }
      else {
        return (
          <div className="userHouses">
            {houseNodes}
          </div>
        );
      }
    }
  });

  var House = React.createClass({
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
          console.log(data);
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
          <span title={user.first_name} key={user.id} >
            <img src={user.profile_picture_url} />
          </span>
        );
      });
      return (
        <div className="container">
          <div className="jumbotron">
            <div className="row">
              <div className="col-sm-5">
                <h2>{house.name} <span>{userNodes}</span></h2>
                <ExpenseForm houseId={house.id} onExpenseSubmit={this.handleExpenseSubmit} />
              </div>
              <div className="col-sm-7">
                <HouseExpenses expenses={expenses} loadExpensesFromServer={this.loadExpensesFromServer} />
              </div>
            </div>
          </div>
        </div>
      );
    }
  });

  var HouseExpenses = React.createClass({
    componentDidMount: function() {
      this.props.loadExpensesFromServer();
    },
    render: function() {
      var expenses = this.props.expenses;
      var expenseNodes = expenses.map(function(expense) {
        return (
          <div className="media list-group-item" href="#" key={expense.id}>
            <div className="media-left">
              <img className="media-object" src={expense.user.profile_picture_url} />
            </div>
            <div className="media-body">
              <p className="media-heading "><small>added ${expense.amount} for {expense.note}</small></p>
              <p><small><small>{Dateify.sayDays(expense.created_at) + " at " + Dateify.sayTime(expense.created_at)}</small></small></p>
            </div>
            <ExpenseCharges expense={expense} />
          </div>
        );
      });
      if (expenses.length > 0) {
        return (
          <div className="list-group house-expenses well">
            {expenseNodes}
          </div>
        );
      }
      else {
        return (
          <div className="list-group house-expenses well">
            <h3>No expenses have been added yet!</h3>
          </div>
        );
      };
    }
  });

  var ExpenseCharges = React.createClass({
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
          <div className="list-group-item well no-padding group-tight" key={charge.id}>
            <div className={chargeStatus}>
              <img src={charge.user.profile_picture_url} />
              <span> {message}</span><span className={"pull-right " + glyphicon}></span>
            </div>
          </div>
        );
      });
      return (
        <div className="expense-charges">
          <a className ={"btn " + expenseStatus} data-toggle="collapse" href={"#" + expenseId} aria-expanded="false" aria-controls="collapseExample">
            <span className="caret" /> Charges <span className="badge">{numPending} pending</span>
          </a>
          <div className="list-group collapse" id={expenseId}>
            {chargeNodes}
          </div>
        </div>
      );
    }
  });

  var ExpenseForm = React.createClass({
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
        <form className="expense-form" onSubmit={this.handleSubmit}>
          <div className="form-group group-tight">
            <label className="sr-only" htmlFor={"inputAmount" + houseId}>Amount (in dollars)</label>
            <div className="input-group">
              <div className="input-group-addon">$</div>
              <input type="text" className="form-control" id={"inputAmount" + houseId} placeholder="Amount" ref="amount" />
            </div>
          </div>
          <div className="form-group group-tight">
            <label className="sr-only" htmlFor={"inputDescription" + houseId}>Expense description</label>
            <textarea className="form-control" id={"inputDescription" + houseId} placeholder="Add a description" rows="3" ref="description"></textarea>
          </div>
          <div className="form-group group-tight">
            <button type="submit" className="btn btn-primary btn-block" id={"expense-form-button" + houseId} data-loading-text="Adding...">Add Expense</button>
          </div>
        </form>
      );
    }
  });

  React.render(
    <RoomiesApp />,
    document.getElementById('content')
  );
}());