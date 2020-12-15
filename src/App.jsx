import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import Samples from "./Samples";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Samples} />
        </div>
      </Router>
    );
  }
}

export default App;
