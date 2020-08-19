import React, { Component } from "react";
import { Link } from "react-router-dom";
import history from "../history";
import 'bootstrap/dist/css/bootstrap.min.css';
import PrivateLayout from './PrivateLayout'

class Product extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fullname: "",
      email: "",
      password: "",
      products : []
    };
  }

  update = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value,
    });
  };
  postData = async (url = "", data = {}) => {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "authorization":"Bearer "+localStorage.getItem("authToken")
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    return response.json();
  };
  getData = async (url = "/api/product") => {
      var self = this
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "authorization":"Bearer "+localStorage.getItem("authToken")
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer",
    
    });
    const result = response.json();
    return result
    
  };

  fetchProduct = ()=>{
    var self = this
    this.getData().then(
      (data) => {
        console.log(data); // JSON data parsed by `data.json()` call
        if (!data.error) {
          self.setState({products:data.data,edit:false})
        } else {
          alert(data.userMessage);
        }
      }
    );
  }

  addProduct = (e) => {
    e.preventDefault();
    console.log("You have successfully registered");
    console.log(this.state);
    const { name, price, description,edit,selectedProduct } = this.state;
    if (!price || !name || !description) {
      alert("Please fill mandatory fields");
      return false;
    } 
    var self = this
    var url = "/api/product/save"
    if(edit){
        url = "/api/product/update/"+selectedProduct._id
    }
    
    this.postData(url, { name, price, description }).then(
      (data) => {
        console.log(data); // JSON data parsed by `data.json()` call
        if (!data.error) {
          self.fetchProduct()
        } else {
          alert(data.userMessage);
        }
      }
    );
  };
componentDidMount(){
this.fetchProduct()
}
delete =(product)=>{
console.log(product)
var self = this
const url = "/api/product/delete/"+product._id
this.postData(url, {} ).then(
    (data) => {
      console.log(data); // JSON data parsed by `data.json()` call
      if (!data.error) {
        self.fetchProduct()
      } else {
        alert(data.userMessage);
      }
    }
  );
}
edit =(product)=>{
    console.log(product)
    const {name,price,description} = product
    this.setState({
        name,price,description,edit:true,selectedProduct:product
    })
    }
  render() {
var self = this

    return (
      <PrivateLayout>
    <div className="row" style={{width:'inherit'}}>
         
         <div className="col-md-8">
         <table className="table">
   <thead>
     <tr>
       
       <th scope="col">Name</th>
       <th scope="col">Price</th>
       <th scope="col">Description</th>
       <th scope="col">Actions</th>
     </tr>
   </thead>
   <tbody>
       {this.state.products.map(function(product,index){
           return <tr key={index}>
         
       <td>{product.name}</td>
       <td>{product.price}</td>
       <td>{product.description}</td>
       <td>
           <button style={{marginRight:'10px'}} type="button" className="btn btn-primary" onClick={()=>{
               self.edit(product)
           }}>Edit</button>
           <button type="button" className="btn btn-danger" onClick={()=>{
               self.delete(product)
           }}>Delete</button>
       </td>
         </tr>
       })}
     
   </tbody>
 </table>
 
 
         </div>
         <div className="col-md-4">
           <div className="">
             <form onSubmit={this.addProduct}>
 
               <div className="name">
                 <input
                   type="text"
                   placeholder="Name of product"
                   name="name"
                   value={this.state.name}
                   onChange={this.update}
                 />
               </div>
 
               <div className="email">
                 <input
                   type="number"
                   placeholder="price"
                   name="price"
                   value={this.state.price}
                   onChange={this.update}
                 />
               </div>
 
               <div className="pasword">
                 <textarea
                   type="text"
                   placeholder="description"
                   name="description"
                   value={this.state.description}
                   onChange={this.update}
                 />
               </div>
 
               <input type="submit" value={self.state.edit?"Update Product":"Add Product"}/>
             </form>
 
             {/* <Link to="/">Login Here</Link> */}
           </div>
         </div>
       </div>
     
      </PrivateLayout>
  );
  }
}

export default Product;
