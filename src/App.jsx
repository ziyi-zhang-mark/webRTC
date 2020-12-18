import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import Samples from "./Samples";
import Camera from "./Camera";
import Microphone from "./Microphone";
import Canvas from "./Canvas";
import ScreenShare from "./ScreenShare";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Samples} />
          <Route exact path="/camera" component={Camera} />
          <Route exact path="/microphone" component={Microphone} />
          <Route exact path="/canvas" component={Canvas} />
          <Route exact path="/screenShare" component={ScreenShare} />
        </div>
      </Router>
    );
  }
}

export default App;
