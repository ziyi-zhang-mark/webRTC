import React from "react";
import { Button } from "antd";
import "../styles/css/pc-canvas.scss";

let canvas;
let context;
let remoteVideo;
let localStream;
// local
let localConnection;
// remote
let remoteConnection;

class PeerConnectionCanvas extends React.Component {
  componentDidMount() {
    remoteVideo = this.refs["remoteVideo"];
    canvas = this.refs["canvas"];
    this.startCaptureCanvas();
  }

  startCaptureCanvas = async () => {
    localStream = canvas.captureStream(10);
    this.drawLine();
  };

  drawLine = () => {
    context = canvas.getContext("2d");
    context.fillStyle = "#FFF";
    context.fillRect(0, 0, 320, 240);
    context.lineWidth = 1;
    context.strokeStyle = "#FF0000";

    canvas.addEventListener("mousedown", this.startAction);
    canvas.addEventListener("mouseup", this.endAction);
  };

  startAction = (event) => {
    context.beginPath();
    context.moveTo(event.offsetX, event.offsetY);

    context.stroke();
    canvas.addEventListener("mousemove", this.moveAction);
  };

  moveAction = (event) => {
    context.lineTo(event.offsetX, event.offsetY);
    context.stroke();
  };

  endAction = () => {
    canvas.removeEventListener("mousemove", this.moveAction);
  };

  call = async () => {
    // 视频轨道
    const videoTracks = localStream.getVideoTracks();

    // 音频轨道
    const audioTracks = localStream.getAudioTracks();

    if (videoTracks.length > 0) {
      console.log(`使用的视频设备是: ${videoTracks[0].label}`);
    }

    if (audioTracks.length > 0) {
      console.log(`使用的音频设备是: ${audioTracks[0].label}`);
    }

    let configuration = {
      iceServers: [{ url: "stun:stun.l.google.com:19302" }],
    };

    localConnection = new RTCPeerConnection(configuration);
    localConnection.addEventListener("icecandidate", this.onLocalIceCandidate);

    remoteConnection = new RTCPeerConnection(configuration);
    remoteConnection.addEventListener(
      "icecandidate",
      this.onRemoteIceCandidate
    );

    localConnection.addEventListener(
      "iceconnectionstatechange",
      this.onLocalIceStateChange
    );
    remoteConnection.addEventListener(
      "iceconnectionstatechange",
      this.onRemoteIceStateChange
    );

    remoteConnection.addEventListener("track", this.gotRemoteStream);

    // A 将stream/track 加到 PCA 里
    localStream.getTracks().forEach((track) => {
      localConnection.addTrack(track, localStream);
    });

    // offer
    try {
      const offer = await localConnection.createOffer();
      await this.onCreateOfferSuccess(offer);
    } catch (e) {
      this.onCreateSessionDescriptionError(e);
    }
  };

  onCreateOfferSuccess = async (desc) => {
    console.log(`localConnection 创建 offer 返回的SDP信息`);
    console.log(desc.sdp);
    console.log("设置 localConnection 的本地描述 start");

    try {
      await localConnection.setLocalDescription(desc);
      this.onSetLocalSuccess(localConnection);
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }

    try {
      await remoteConnection.setRemoteDescription(desc);
      this.onSetRemoteSuccess(remoteConnection);
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }

    try {
      const answer = await remoteConnection.createAnswer();
      this.onCreateAnswerSuccess(answer);
    } catch (e) {
      this.onCreateSessionDescriptionError(e);
    }
  };

  onSetLocalSuccess = (pc) => {
    console.log(`${this.getName(pc)} 设置local描述完成: setLocalDescription`);
  };

  onSetRemoteSuccess = (pc) => {
    console.log(`${this.getName(pc)} 设置remote描述完成: setLocalDescription`);
  };

  getName = (pc) => {
    return pc === localConnection ? "localConnection" : "remoteConnection";
  };

  onCreateSessionDescriptionError = (error) => {
    console.log("创建会话描述 SD 错误: ", error.toString());
  };

  onSetSessionDescriptionError = (error) => {
    console.log("设置会话描述 SD 错误: ", error.toString());
  };

  onCreateAnswerSuccess = async (desc) => {
    console.log(`remoteConnection 的应答 Answer 数据`);
    console.log(desc.sdp);
    console.log(`remoteConnection 设置本地描述开始`);
    try {
      await remoteConnection.setLocalDescription(desc);
      this.onSetLocalSuccess(remoteConnection);
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }

    try {
      await localConnection.setRemoteDescription(desc);
      this.onSetRemoteSuccess(localConnection);
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }
  };

  onLocalIceStateChange = (event) => {
    console.log(
      `localConnection 连接的ICE状态: ${localConnection.iceConnectionState}`
    );
    console.log("ICE 状态改变事件: ", event);
  };

  onRemoteIceStateChange = (event) => {
    console.log(
      `remoteConnection 连接的ICE状态: ${remoteConnection.iceConnectionState}`
    );
    console.log("ICE 状态改变事件: ", event);
  };

  onLocalIceCandidate = async (event) => {
    try {
      if (event.candidate) {
        // A 收到 candidate 信息, 发给B
        await remoteConnection.addIceCandidate(event.candidate);
        this.onAddIceCandidateSuccess(remoteConnection);
      }
    } catch (e) {
      this.onAddIceCandidateError(localConnection, e);
    }

    console.log(
      `IceCandidate数据: \n${
        event.candidate ? event.candidate.candidate : "(null)"
      }`
    );
  };

  onRemoteIceCandidate = async (event) => {
    try {
      if (event.candidate) {
        // B 收到 candidate 信息, 发给A
        await localConnection.addIceCandidate(event.candidate);
        this.onAddIceCandidateSuccess(localConnection);
      }
    } catch (e) {
      this.onAddIceCandidateError(remoteConnection, e);
    }

    console.log(
      `IceCandidate数据: \n${
        event.candidate ? event.candidate.candidate : "(null)"
      }`
    );
  };

  onAddIceCandidateSuccess = (pc) => {
    console.log(`${this.getName(pc)} 添加IceCandidate成功`);
  };

  onAddIceCandidateError = (pc, error) => {
    console.log(
      `${this.getName(pc)} 添加IceCandidate失败: ${error.toString()}`
    );
  };

  gotRemoteStream = (e) => {
    if (remoteVideo.srcObject !== e.streams[0]) {
      remoteVideo.srcObject = e.streams[0];
    }
  };

  hangup = () => {
    console.log("会话结束");
    localConnection.close();
    remoteConnection.close();
    localConnection = null;
    remoteConnection = null;
  };

  render() {
    return (
      <div className="container">
        <h1>
          <span>示例</span>
        </h1>
        <div className="small-canvas">
          <canvas ref="canvas"></canvas>
        </div>

        <video
          className="small-video"
          ref="remoteVideo"
          playsInline
          autoPlay
        ></video>

        <div>
          <Button onClick={this.call}>呼叫</Button>
          <Button onClick={this.hangup}>挂断</Button>
        </div>
      </div>
    );
  }
}

export default PeerConnectionCanvas;
