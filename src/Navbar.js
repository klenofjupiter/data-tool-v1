import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Navbar = () => (
   <div className="Navbar App">
     <header className="App-header">
          <h1 className="App-title"><Link to="/">Most Delightful and Extraordinary Charts and Graphs</Link></h1>
     </header>
   </div>
)

export default Navbar;