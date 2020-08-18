import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import history from '../history';
import Publiclayout from './PublicLayout'

class Register extends Component {
	constructor(props) {
		super(props);

		this.state = {
			fullname: '',
			email: '',
			password: ''
		};

		
	}

	update =(e) =>{
		let name = e.target.name;
		let value = e.target.value;
		this.setState({
			[name]: value
		});
	}
	postData = async (url = '', data = {})=> {
	
		const response = await fetch(url, {
		  method: 'POST', 
		  mode: 'cors', 
		  cache: 'no-cache', 
		  credentials: 'same-origin', 
		  headers: {
			'Content-Type': 'application/json'
			// 'Content-Type': 'application/x-www-form-urlencoded',
		  },
		  redirect: 'follow', // manual, *follow, error
		  referrerPolicy: 'no-referrer',
		  body: JSON.stringify(data) 
		});
		return response.json(); 
	  }

	performregister =(e)=> {
		e.preventDefault();
		console.log('You have successfully registered');
		console.log(this.state);
		const {email,name,password,password1} = this.state
		if(!email||!name||!password||!password1){
			alert("Please fill mandatory fields")
			return false
		}else if(password1!==password){
			alert("Password doent match")
			return false
		}
		this.postData("/api/user/signup", { name,email, password }).then((data) => {
			console.log(data); // JSON data parsed by `data.json()` call
			if (!data.error) {
				history.push('/')
			} else {
			  alert(data.userMessage);
			}
		  });
	}

	render() {
		return (
			<Publiclayout>
		<div className="register">
				<form onSubmit={this.performregister}>
					<h2>Register</h2>

					<div className="name">
						<input
							type="text"
							placeholder="Full Name"
							name="name"
							value={this.state.name}
							onChange={this.update}
						/>
					</div>

					<div className="email">
						<input
							type="text"
							placeholder="Enter your email"
							name="email"
							value={this.state.email}
							onChange={this.update}
						/>
					</div>

					<div className="pasword">
						<input
							type="password"
							placeholder="Password"
							name="password"
							value={this.state.password}
							onChange={this.update}
						/>
					</div>

					<div className="password">
						<input type="password" placeholder="Confirm Password" name="password1" onChange={this.update} />
					</div>

					<input type="submit" value="Login" />
				</form>

				<Link to="/">Login Here</Link>
			</div>
		
			</Publiclayout>
	);
	}
}

export default Register;
