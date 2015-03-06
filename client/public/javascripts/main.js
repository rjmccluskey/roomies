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
      return (
        <div className="container">
          <div className="jumbotron">
            <h1>{house.name}</h1>
          </div>
        </div>
      );
    }
  });

  var HouseUser = React.createClass({
    render: function() {
      return (

      );
    }
  });

  React.render(
    <RoomiesApp />,
    document.getElementById('content')
  );
}());