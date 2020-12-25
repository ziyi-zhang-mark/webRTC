import React from "react";
import { Button } from "antd";
import "../styles/css/record-video.scss";

let mediaRecorder;
// 缓存
let recordedBlobs;

let stream;

class RecordScreen extends React.Component {
  startCaptureScreen = async () => {
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: 2880, height: 1800 },
      });

      const video = this.refs["myVideo"];
      window.stream = stream;
      video.srcObject = stream;
      this.startRecord();
    } catch (e) {}
  };

  startRecord = () => {
    stream.addEventListener("inactive", (e) => {
      this.stopRecord();
    });
    recordedBlobs = [];

    try {
      mediaRecorder = new MediaRecorder(window.stream, {
        mineType: "video/webm",
      });
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
  };

  stopRecord = () => {
    mediaRecorder.stop();
    stream.getTracks().forEach((track) => track.stop());
    stream = null;

    const blob = new Blob(recordedBlobs, { type: "video/webm" });
    const url = window.URL.createObjectURL(blob);
    console.log("url", url);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "screen.webm";
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
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

        <video className="video" ref="myVideo" playsInline autoPlay></video>

        <div>
          <Button className="button" onClick={this.startCaptureScreen}>
            开始
          </Button>
        </div>
      </div>
    );
  }
}

export default RecordScreen;
