import React from "react";
import News from "./components/News";
import "./app.css";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Nav from './components/Nav'
import Signin from "./components/Signin";
import Signup from "./components/Signup"
import { useContext } from "react"
import { AuthContext } from "./Context/AuthContext.js"
import Chatroom from "./components/Chatroom";

function App() {

  const { user } = useContext(AuthContext)

  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route exact path='/'>
            {user ? <News /> : <Signin />}
          </Route>
          <Route exact path='/signin'>
            {user ? <Redirect to='/' /> : <Signin />}
          </Route>
          <Route exact path='/signup'>
            {user ? <Redirect to='/' /> : <Signup />}
          </Route>
          <Route exact path='/chatroom'>
            {user ? <Chatroom /> : <Signin />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
