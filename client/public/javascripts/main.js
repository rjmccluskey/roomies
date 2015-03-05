(function(){
  var UserInfo = React.createClass({
    loadUserFromServer: function() {
      $.ajax({
        url: "/users",
        dataType: 'json',
        success: function(data) {
          console.log(this);
          this.setState(data);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },
    getInitialState: function() {
      return {user: {}};
    },
    componentDidMount: function() {
      this.loadUserFromServer();
    },
    render: function() {
      var user = this.state.user;
      return (
        <div className="userInfo container">
          <img src={user.profile_picture_url} />
          <h1>{user.first_name}</h1>
        </div>
      );
    }
  });

  React.render(
    <UserInfo />,
    document.getElementById('content')
  );
}());