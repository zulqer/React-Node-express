import React, { Component } from "react";
import { Link } from "react-router-dom";
import history from '../history';
import Publiclayout from './PublicLayout'
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };

    this.update = this.update.bind(this);
  }

  update(e) {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value,
    });
  }
  postData = async (url = "", data = {}) => {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    return response.json();
  };
  PerformLogin = (e) => {
    e.preventDefault();
    console.log("You are logged in");
    console.log(this.state);
    const { email, password } = this.state;
    this.setState({
      email: "",
      password: "",
    });
    this.postData("/api/user/login", { email, password }).then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
      if (!data.error) {
        localStorage.setItem("authToken", data.data.authToken);
		localStorage.setItem("user", data.data.user);
		setTimeout(function(){
			history.push('/product')
		},0)
      } else {
        alert(data.userMessage);
      }
    });
  };

  render() {
    return (
      <Publiclayout>
   <div className="login">
        <form onSubmit={this.PerformLogin}>
          <h2>Login</h2>
          <div className="username">
            <input
              type="text"
              placeholder="Username..."
              value={this.state.email}
              onChange={this.update}
              name="email"
            />
          </div>

          <div className="password">
            <input
              type="password"
              placeholder="Password..."
              value={this.state.password}
              onChange={this.update}
              name="password"
            />
          </div>

          <input type="submit" value="Login" />
        </form>

        <Link to="/register">Create an account</Link>
      </div>
   
      </Publiclayout>
    );
  }
}

export default Login;
