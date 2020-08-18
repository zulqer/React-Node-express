import React, { Component } from "react";
import history from '../history';

class PublicLayout extends Component {

    constructor(props){
        super(props)
        if(localStorage.getItem('authToken')){
            history.push('/product')
        }
    }
    render(){
        return(<div className="container">
            {this.props.children}
        </div> )
    }
}
export default PublicLayout