import React from "react";
import { message, Select } from "antd";
import "../styles/css/video-filter.scss";

const { Option } = Select;

let video;

class VideoFilter extends React.Component {
  componentDidMount() {
    video = this.refs["video"];

    const constraints = {
      audio: false,
      video: true,
    };

    const stream = navigator.mediaDevices
      .getUserMedia(constraints)
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  handleSuccess = (stream) => {
    window.stream = stream;
    video.srcObject = stream;
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

  handleChange = (value) => {
    video.className = value;
  };

  render() {
    return (
      <div className="container">
        <h1>
          <span>滤镜示例</span>
        </h1>
        <video ref="video" autoPlay playsInline></video>
        <Select
          defaultValue="none"
          style={{ width: "100px" }}
          onChange={this.handleChange}
        >
          <Option value="none">没有滤镜</Option>
          <Option value="blur">模糊</Option>
          <Option value="grayscale">灰度</Option>
          <Option value="invert">反转</Option>
          <Option value="sepia">深褐色</Option>
        </Select>
      </div>
    );
  }
}

export default VideoFilter;
