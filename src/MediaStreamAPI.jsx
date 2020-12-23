import React from "react";
import { Button, message } from "antd";

let stream;
class MediaStreamAPI extends React.Component {
  componentDidMount() {
    this.openDevice();
  }

  openDevice = async (e) => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const video = this.refs["myVideo"];
      video.srcObject = stream;
    } catch (e) {
      this.handleError(e);
    }
  };

  handleError = (error) => {
    console.log("error", error);
    if (error.name === "ConstraintNotSatisfiedError") {
      const v = constraints.video;
      message.error(`宽: ${v.width.exact} 高: ${v.height.exact} 设备不支持`);
    } else if (error.name === "PermissionDeniedError") {
      message.error("permission denied");
    } else {
      message.error("getUserMedia 错误");
    }
  };

  btnGetTracks = () => {
    console.log("btnGetTracks");
    console.log(stream.getTracks());
  };

  btnGetAudioTracks = () => {
    console.log("btnGetAudioTracks");
    console.log(stream.getAudioTracks());
  };

  btnGetVideoTracks = () => {
    console.log("btnGetVideoTracks");
    console.log(stream.getVideoTracks());
  };

  btnRemoveAudioTrack = () => {
    console.log("btnRemoveAudioTracks");
    stream.removeTrack(stream.getAudioTracks()[0]);
  };

  btnGetTrackById = () => {
    console.log("btnGetTrackById");
    console.log(stream.getTrackById(stream.getAudioTracks()[0].id));
  };

  render() {
    return (
      <div className="container">
        <h1>
          <span>摄像头示例</span>
        </h1>
        <video className="video" ref="myVideo" autoPlay playsInline></video>
        <Button onClick={this.btnGetTracks}>获取所有轨道</Button>
        <Button onClick={this.btnGetAudioTracks}>获取音频轨道</Button>
        <Button onClick={this.btnGetVideoTracks}>获取视频轨道</Button>
        <Button onClick={this.btnRemoveAudioTrack}>删除音频轨道</Button>
        <Button onClick={this.btnGetTrackById}>根据id获取音频轨道</Button>
      </div>
    );
  }
}

export default MediaStreamAPI;
