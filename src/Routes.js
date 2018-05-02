import React from 'react';
import App from './App';
import Navbar from './Navbar';
import Instructions from './Instructions';

import { BrowserRouter as Router, Route } from 'react-router-dom';

const Routes = () => (
 <Router>
   <div>
    <Route path="/" component={Navbar} />
    <Route exact path="/" component={App} />
    <Route exact path="/info" component={Instructions} />
   </div>
 </Router>
)

export default Routes;