import React from "react";
import { Button, Select, Modal } from "antd";
import "../../styles/css/media-settings.scss";
import SoundMeter from "./soundmeter";

const { Option } = Select;
let videoElement;

export default class MediaSettings extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      selectedAudioInputDevice: "",
      selectedVideoInputDevice: "",
      audioInputDevices: [],
      audioOutputDevices: [],
      videoInputDevices: [],
      resolution: "vga",
      audioLevel: 0,
    };

    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      window.audioContext = new AudioContext();
    } catch (e) {
      console.log("网页音频API不支持");
    }
  }

  componentDidMount() {
    if (window.localStorage) {
      let deviceInfo = localStorage["deviceInfo"];
      if (deviceInfo) {
        let info = JSON.parse(deviceInfo);
        this.setState({
          selectedAudioInputDevice: info.audioInputDevice,
          selectedVideoInputDevice: info.videoInputDevice,
          resolution: info.resolution,
        });
      }
    }

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

  soundMeterProcess = () => {
    const val = window.soundMeter.instant.toFixed(2) * 348 + 1;
    this.setState({ audioLevel: val });
    if (this.state.visible) {
      setTimeout(this.soundMeterProcess, 100);
    }
  };

  stopPreview = () => {
    if (window.stream) {
      this.closeMediaStream(window.stream);
    }
  };

  startPreview = () => {
    //
    if (window.stream) {
      this.closeMediaStream(window.stream);
    }
    this.soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
    let soundMeterProcess = this.soundMeterProcess;

    videoElement = this.refs["previewVideo"];
    let audioSource = this.state.selectedAudioInputDevice;
    let videoSource = this.state.selectedVideoInputDevice;

    const constaints = {
      audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
      video: { deviceId: videoSource ? { exact: videoSource } : undefined },
    };

    navigator.mediaDevices
      .getUserMedia(constaints)
      .then((stream) => {
        window.stream = stream;
        videoElement.srcObject = stream;

        this.soundMeter.connectToSource(stream);
        setTimeout(soundMeterProcess, 100);

        return navigator.mediaDevices.enumerateDevices();
      })
      .then((devices) => {})
      .catch((e) => {
        console.log(e);
      });
  };

  closeMediaStream = (stream) => {
    if (!stream) {
      return;
    }
    let tracks, i, len;
    if (stream.getTracks) {
      tracks = stream.getTracks();
      len = tracks.length;
      for (i = 0; i < len; i++) {
        tracks[i].stop();
      }
    } else {
      tracks = stream.getAudioTracks();
      len = tracks.length;
      for (i = 0; i < len; i++) {
        tracks[i].stop();
      }

      tracks = stream.getVideoTracks();
      len = tracks.length;
      for (i = 0; i < len; i++) {
        tracks[i].stop();
      }
    }
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    setTimeout(this.startPreview, 100);
  };

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
    if (window.localStorage) {
      let deviceInfo = {
        audioInputDevice: this.state.selectedAudioInputDevice,
        videoInputDevice: this.state.selectedVideoInputDevice,
        resolution: this.state.resolution,
      };
      localStorage["deviceInfo"] = JSON.stringify(deviceInfo);
    }
    this.stopPreview();
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
    this.stopPreview();
  };

  handleAudioInputDeviceChange = (device) => {
    this.setState({ selectedAudioInputDevice: device });
    setTimeout(this.startPreview, 100);
  };

  handleVideoInputDeviceChange = (device) => {
    this.setState({ selectedVideoInputDevice: device });
    setTimeout(this.startPreview, 100);
  };

  handleResolutionChange = (resolution) => {
    this.setState({ resolution });
  };

  render() {
    return (
      <div className="container">
        <h1>
          <span>设置综合示例</span>
        </h1>
        <Button onClick={this.showModal}>修改设备</Button>
        <Modal
          title="修改设备"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确定"
          cancelText="取消"
        >
          <div className="item">
            <span className="item-left">麦克风</span>
            <div className="item-right">
              <Select
                value={this.state.selectedAudioInputDevice}
                style={{ width: 350 }}
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
              <div
                ref="progressbar"
                style={{
                  width: this.state.audioLevel + "px",
                  height: "10px",
                  backgroundColor: "#8dc63f",
                  marginTop: "20px",
                }}
              ></div>
            </div>
          </div>
          <div className="item">
            <span className="item-left">摄像头</span>
            <div className="item-right">
              <Select
                value={this.state.selectedVideoInputDevice}
                style={{ width: 350 }}
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
              <div className="video-container">
                <video
                  id="previewVideo"
                  ref="previewVideo"
                  autoPlay
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                ></video>
              </div>
            </div>
          </div>
          <div className="item">
            <span className="item-left">清晰度</span>
            <div className="item-right">
              <Select
                style={{ width: 350 }}
                value={this.state.resolution}
                onChange={this.handleResolutionChange}
              >
                <Option value="qvga">流畅(320x240)</Option>
                <Option value="vga">标清(640x360)</Option>
                <Option value="hd">高清(1280x720)</Option>
                <Option value="fullhd">超清(1920x1080)</Option>
              </Select>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
