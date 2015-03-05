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
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },
    getInitialState: function() {
      return (
        {
          data: {
            user: {
              first_name: "",
              profile_picture_url: ""
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
        <NavBar data={this.state.data} />
      );
    }
  });

  var NavBar = React.createClass({
    render: function() {
      var user = this.props.data.user;
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
              <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
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

  var UserIcon = React.createClass({
    render: function() {
      var user = this.props.user;
      return (
        <div className="userIcon">
          <span>{user.first_name}</span>
          <img src={user.profile_picture_url} />
        </div>
      );
    }
  });

  React.render(
    <RoomiesApp />,
    document.getElementById('content')
  );
}());