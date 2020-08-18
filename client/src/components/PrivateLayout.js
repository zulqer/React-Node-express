import React, { Component } from "react";
import history from '../history';

class PrivateLayout extends Component {

    constructor(props){
        super(props)
    }
    render(){
        return(<div className="hghj">
            <div>
                <div style={{padding:'10px',color:'red',cursor:'pointer',textAlign:'right'}} onClick={()=>{
                    localStorage.clear()
                    history.push('/')
                }}>Logout</div>
            </div>
            {this.props.children}
        </div> )
    }
}
export default PrivateLayout