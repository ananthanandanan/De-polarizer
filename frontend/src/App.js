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
          <Route
            exact
            path="/survey"
            component={() => {
              window.location.href = "http://127.0.0.1:5500/political-compass/index.html";
              return null;
            }}
          />
          <Route exact path='/chatroom/:random_user_id/:chatroom_id'>
            {user ? <Chatroom /> : <Signin />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
