import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import Samples from "./Samples";
import Camera from "./Camera";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Samples} />
          <Route exact path="/camera" component={Camera} />
        </div>
      </Router>
    );
  }
}

export default App;
