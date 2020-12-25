import React from "react";
import { Button } from "antd";
import "../styles/css/record-video.scss";

let mediaRecorder;
// 缓存
let recordedBlobs;
let videoPreview;
let videoPlayer;

class RecordVideo extends React.Component {
  constructor() {
    super();
    this.state = {
      status: "start",
    };
  }

  componentDidMount() {
    videoPreview = this.refs["videoPreview"];
    videoPlayer = this.refs["videoPlayer"];
  }

  startClickHandler = async () => {
    let constraints = {
      audio: true,
      video: {
        width: 1280,
        height: 720,
      },
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      window.stream = stream;
      videoPreview.srcObject = stream;

      this.setState({
        status: "startRecord",
      });
    } catch (e) {
      console.log("navigator.mediaDevices.getUserMedia: ", e);
    }
  };

  startRecordButtonClickHandler = () => {
    recordedBlobs = [];
    let options = { mineType: "video/webm;codecs=vp9" };

    if (!MediaRecorder.isTypeSupported(options.mineType)) {
      console.log("video/webm;codecs=vp9 不支持");
      options = { mineType: "video/webm;codecs=vp8" };
      if (!MediaRecorder.isTypeSupported(options.mineType)) {
        console.log("video/webm;codecs=vp8 不支持");
        options = { mineType: "video/webm" };
        if (!MediaRecorder.isTypeSupported(options.mineType)) {
          console.log("video/webm 不支持");
          options = { mineType: "" };
        }
      }
    }

    try {
      mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
      console.log("MediaRecorder: ", e);
      return;
    }

    mediaRecorder.onstop = (event) => {
      console.log("Recorder stopped: ", event);
      console.log("Recorder blobs: ", recordedBlobs);
    };

    mediaRecorder.ondataavailable = this.handleDataAvailable;

    mediaRecorder.start(10);
    this.setState({
      status: "stopRecord",
    });
  };

  stopRecordButtonClickHandler = () => {
    mediaRecorder.stop();
    this.setState({
      status: "play",
    });
  };

  playButtonClickHandler = () => {
    const blob = new Blob(recordedBlobs, { type: "video/webm" });
    videoPlayer.src = null;
    videoPlayer.src = window.URL.createObjectURL(blob);
    videoPlayer.controls = true;
    videoPlayer.play();

    this.setState({
      status: "download",
    });
  };

  downloadButtonClickHandler = () => {
    const blob = new Blob(recordedBlobs, { type: "video/webm" });
    const url = window.URL.createObjectURL(blob);
    console.log("url", url);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "test.webm";
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);

    this.setState({
      status: "start",
    });
  };

  handleDataAvailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  };

  render() {
    return (
      <div className="container">
        <h1>
          <span>摄像头示例</span>
        </h1>

        <video
          className="small-video"
          ref="videoPreview"
          playsInline
          autoPlay
          muted
        ></video>

        <video
          className="small-video"
          ref="videoPlayer"
          playsInline
          loop
        ></video>
        <div>
          <Button
            className="button"
            onClick={this.startClickHandler}
            disabled={this.state.status !== "start"}
          >
            打开摄像头
          </Button>

          <Button
            className="button"
            onClick={this.startRecordButtonClickHandler}
            disabled={this.state.status !== "startRecord"}
          >
            开始录制
          </Button>

          <Button
            className="button"
            onClick={this.stopRecordButtonClickHandler}
            disabled={this.state.status !== "stopRecord"}
          >
            停止录制
          </Button>

          <Button
            className="button"
            onClick={this.playButtonClickHandler}
            disabled={this.state.status !== "play"}
          >
            播放
          </Button>

          <Button
            className="button"
            onClick={this.downloadButtonClickHandler}
            disabled={this.state.status !== "download"}
          >
            下载
          </Button>
        </div>
      </div>
    );
  }
}

export default RecordVideo;
