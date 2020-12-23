import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import Samples from "./Samples";
import Camera from "./Camera";
import Microphone from "./Microphone";
import Canvas from "./Canvas";
import ScreenShare from "./ScreenShare";
import VideoFilter from "./VideoFilter";
import Resolution from "./Resolution";
import AudioVolume from "./volume/AudioVolume";
import DeviceSelect from "./DeviceSelect";
import MediaSettings from "./media-settings/MediaSettings";
import MediaStreamAPI from "./MediaStreamAPI";

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
          <Route exact path="/audioVolume" component={AudioVolume} />
          <Route exact path="/deviceSelect" component={DeviceSelect} />
          <Route exact path="/mediaSettings" component={MediaSettings} />
          <Route exact path="/mediaStreamAPI" component={MediaStreamAPI} />
        </div>
      </Router>
    );
  }
}

export default App;
