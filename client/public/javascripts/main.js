(function(){
  var RoomiesApp = React.createClass({
    loadUserFromServer: function() {
      $.ajax({
        url: "/users",
        dataType: 'json',
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error("/users", status, err.toString());
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
            }
          }
        }
      );
    },
    componentDidMount: function() {
      this.loadUserFromServer();
    },
    render: function() {
      return (
        <AllRoomieElements data={this.state.data} />
      );
    }
  });

  var AllRoomieElements = React.createClass({
    render: function() {
      var data = this.props.data;
      return (
        <div className="roomiesApp">
          <NavBar user={data.user} />
          <UserHouses houses={data.user.houses} />
        </div>
      );
    }
  });

  var NavBar = React.createClass({
    render: function() {
      var user = this.props.user;
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
              <a className="navbar-brand" href="#">roomies</a>
            </div>


            <div className="collapse navbar-collapse" id="navbar-collapse">
              <ul className="nav navbar-nav">
                <li><a href="#">houses</a></li>
                <li><a href="#">expenses</a></li>
              </ul>
              <UserSearchForm />
              <ul className="nav navbar-nav navbar-right">
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
    render: function() {
      return (
        <form className="navbar-form navbar-left" role="search">
          <div className="form-group">
            <input type="text" className="form-control" placeholder="Search Users" />
          </div>
          <button type="submit" className="btn btn-default">Search</button>
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
      $.ajax({
        url: "/houses/" + this.props.house.id,
        dataType: 'json',
        success: function(data) {
          this.setState(data);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error("/houses", status, err.toString());
        }.bind(this)
      });
    },
    getInitialState: function() {
      return(
        {
          house: {
            users: []
          }
        }
      );
    },
    componentDidMount: function() {
      this.loadHouseFromServer();
    },
    render: function() {
      var house = this.props.house;
      var users = this.state.house.users;

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
                <ExpenseForm houseId={house.id} />
              </div>
              <div className="col-sm-7">
                <HouseExpenses houseId={house.id} />
              </div>
            </div>
          </div>
        </div>
      );
    }
  });

  var HouseExpenses = React.createClass({
    loadExpensesFromServer: function() {
      url = "/houses/" + this.props.houseId + "/expenses";
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
    getInitialState: function() {
      return (
        {
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
      this.loadExpensesFromServer();
    },
    render: function() {
      var houseId = this.props.houseId;
      var expenses = this.state.expenses;
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
      return (
        <div className="list-group house-expenses well">
          {expenseNodes}
        </div>
      );
    }
  });

  var ExpenseCharges = React.createClass({
    render: function() {
      var expense = this.props.expense;
      var expenseId = "expense-charges" + expense.id;
      var numPending = expense.charges.length;
      var expenseStatus = "btn-warning"
      for (var i = 0; i < expense.charges.length; i++) {
        if (expense.charges[i].date_completed) {
          numPending--;
        }
      };
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
      var houseId = this.props.houseId;
      var amount = this.refs.amount.getDOMNode().value.trim();
      var description = this.refs.description.getDOMNode().value.trim();
      if (!amount || !description) {
        return;
      }
      $.ajax({
        url: "/expenses",
        dataType: 'json',
        type: 'POST',
        data: {house_id: houseId, amount_string: amount, note: description},
        success: function(data) {
        }.bind(this),
        error: function(xhr, status, err) {
          console.error("/expenses", status, err.toString());
        }.bind(this)
      });
      this.refs.amount.getDOMNode.value = "";
      this.refs.description.getDOMNode.value = "";

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
            <button type="submit" className="btn btn-primary btn-block">Add Expense</button>
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