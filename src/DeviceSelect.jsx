import React from "react";
import { Button, Select } from "antd";

const { Option } = Select;
let videoElement;

class DeviceSelect extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedAudioInputDevice: "",
      selectedAudioOutputDevice: "",
      selectedVideoInputDevice: "",
      videoInputDevices: [],
      audioOutputDevices: [],
      audioInputDevices: [],
    };
  }

  componentDidMount() {
    videoElement = this.refs["previewVideo"];
    this.updateDevices().then((data) => {
      if (
        this.state.selectedAudioInputDevice === "" &&
        data.audioInputDevices.length > 0
      ) {
        this.setState({
          selectedAudioInputDevice: data.audioInputDevices[0].deviceId,
        });
      }

      if (
        this.state.selectedAudioOutputDevice === "" &&
        data.audioOutputDevices.length > 0
      ) {
        this.setState({
          selectedAudioOutputDevice: data.audioOutputDevices[0].deviceId,
        });
      }

      if (
        this.state.selectedVideoInputDevice === "" &&
        data.videoInputDevices.length > 0
      ) {
        this.setState({
          selectedVideoInputDevice: data.videoInputDevices[0].deviceId,
        });
      }
      this.setState({
        videoInputDevices: data.videoInputDevices,
        audioInputDevices: data.audioInputDevices,
        audioOutputDevices: data.audioOutputDevices,
      });
    });
  }

  updateDevices = () => {
    return new Promise((resolve, reject) => {
      let videoInputDevices = [];
      let audioInputDevices = [];
      let audioOutputDevices = [];

      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          for (let device of devices) {
            if (device.kind === "videoinput") {
              videoInputDevices.push(device);
            } else if (device.kind === "audioinput") {
              audioInputDevices.push(device);
            } else if (device.kind === "audiooutput") {
              audioOutputDevices.push(device);
            }
          }
        })
        .then(() => {
          let data = {
            videoInputDevices,
            audioInputDevices,
            audioOutputDevices,
          };
          resolve(data);
        });
    });
  };

  handleAudioInputDeviceChange = (device) => {
    this.setState({ selectedAudioInputDevice: device });
    setTimeout(this.startTest, 100);
  };

  handleVideoInputDeviceChange = (device) => {
    this.setState({ selectedVideoInputDevice: device });
    setTimeout(this.startTest, 100);
  };

  handleAudioOutputDeviceChange = (device) => {
    this.setState({ selectedAudioOutputDevice: device });
    if (typeof videoElement.sinkId !== "undefined") {
      videoElement
        .setSinkId(device)
        .then(() => {
          console.log("音频输出设备设置成功");
        })
        .catch((error) => {
          console.log("音频输出设备设置失败");
        });
    } else {
      console.log("浏览器不支持音频输出设备选择");
    }
  };

  startTest = () => {
    let audioSource = this.state.selectedAudioInputDevice;
    let videoSource = this.state.selectedVideoInputDevice;

    const constaints = {
      audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
      video: { deviceId: videoSource ? { exact: videoSource } : undefined },
    };

    navigator.mediaDevices
      .getUserMedia(constaints)
      .then((stream) => {
        window.stram = stream;
        videoElement.srcObject = stream;
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    return (
      <div className="container">
        <h1>
          <span>设备枚举示例</span>
        </h1>
        <Select
          value={this.state.selectedAudioInputDevice}
          style={{ width: 150, marginRight: "10px" }}
          onChange={this.handleAudioInputDeviceChange}
        >
          {this.state.audioInputDevices.map((device, index) => {
            return (
              <Option value={device.deviceId} key={device.deviceId}>
                {device.label}
              </Option>
            );
          })}
        </Select>

        <Select
          value={this.state.selectedAudioOutputDevice}
          style={{ width: 150, marginRight: "10px" }}
          onChange={this.handleAudioOutputDeviceChange}
        >
          {this.state.audioOutputDevices.map((device, index) => {
            return (
              <Option value={device.deviceId} key={device.deviceId}>
                {device.label}
              </Option>
            );
          })}
        </Select>

        <Select
          value={this.state.selectedVideoInputDevice}
          style={{ width: 150 }}
          onChange={this.handleVideoInputDeviceChange}
        >
          {this.state.videoInputDevices.map((device, index) => {
            return (
              <Option value={device.deviceId} key={device.deviceId}>
                {device.label}
              </Option>
            );
          })}
        </Select>

        <video
          className="video"
          ref="previewVideo"
          autoPlay
          playsInline
          style={{ objectFit: "contain", marginTop: "10px" }}
        ></video>
        <Button onClick={this.startTest}>测试</Button>
      </div>
    );
  }
}

export default DeviceSelect;
