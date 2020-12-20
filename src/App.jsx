import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import Samples from "./Samples";
import Camera from "./Camera";
import Microphone from "./Microphone";
import Canvas from "./Canvas";
import ScreenShare from "./ScreenShare";
import VideoFilter from "./VideoFilter";
import Resolution from "./Resolution";

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
          <Route exact path="/videoFilter" component={VideoFilter} />
          <Route exact path="/resolution" component={Resolution} />
        </div>
      </Router>
    );
  }
}

export default App;
