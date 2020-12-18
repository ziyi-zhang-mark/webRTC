import React from "react";
import { Button, message } from "antd";

class ScreenShare extends React.Component {
  // 异步开始
  startScreenShare = async (e) => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      console.log("success");
      this.handleSuccess(stream);
    } catch (e) {
      this.handleError(e);
    }
  };

  handleSuccess = (stream) => {
    const video = this.refs["myVideo"];
    window.stream = stream;
    video.srcObject = stream;
  };

  handleError = (error) => {
    message.error("getDisplayMedia 错误");
  };

  render() {
    return (
      <div className="container">
        <h1>
          <span>共享屏幕示例</span>
        </h1>
        <video className="video" ref="myVideo" autoPlay playsInline></video>
        <Button onClick={this.startScreenShare}>开始共享</Button>
      </div>
    );
  }
}

export default ScreenShare;
