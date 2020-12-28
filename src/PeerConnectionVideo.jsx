import React from "react";
import { Button } from "antd";

let localVideo;
let remoteVideo;
let localStream;
// local
let peerConnectionA;
// remote
let peerConnectionB;

class PeerConnectionVideo extends React.Component {
  canPlay = () => {
    const fps = 0;
    localStream = localVideo.captureStream(fps);
  };

  componentDidMount() {
    localVideo = this.refs["localVideo"];
    remoteVideo = this.refs["remoteVideo"];
  }

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

    peerConnectionA = new RTCPeerConnection(configuration);
    peerConnectionA.addEventListener("icecandidate", this.onIceCandidateA);

    peerConnectionB = new RTCPeerConnection(configuration);
    peerConnectionB.addEventListener("icecandidate", this.onIceCandidateB);

    peerConnectionA.addEventListener(
      "iceconnectionstatechange",
      this.onIceStateChangeA
    );
    peerConnectionB.addEventListener(
      "iceconnectionstatechange",
      this.onIceStateChangeB
    );

    peerConnectionB.addEventListener("track", this.gotRemoteStream);

    // A 将stream/track 加到 PCA 里
    localStream.getTracks().forEach((track) => {
      peerConnectionA.addTrack(track, localStream);
    });

    // offer
    try {
      const offer = await peerConnectionA.createOffer();
      await this.onCreateOfferSuccess(offer);
    } catch (e) {
      this.onCreateSessionDescriptionError(e);
    }
  };

  onCreateOfferSuccess = async (desc) => {
    console.log(`peerConnectionA 创建 offer 返回的SDP信息`);
    console.log(desc.sdp);
    console.log("设置 peerConnectionA 的本地描述 start");

    try {
      await peerConnectionA.setLocalDescription(desc);
      this.onSetLocalSuccess(peerConnectionA);
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }

    try {
      await peerConnectionB.setRemoteDescription(desc);
      this.onSetRemoteSuccess(peerConnectionB);
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }

    try {
      const answer = await peerConnectionB.createAnswer();
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
    return pc === peerConnectionA ? "peerConnectionA" : "peerConnectionB";
  };

  onCreateSessionDescriptionError = (error) => {
    console.log("创建会话描述 SD 错误: ", error.toString());
  };

  onSetSessionDescriptionError = (error) => {
    console.log("设置会话描述 SD 错误: ", error.toString());
  };

  onCreateAnswerSuccess = async (desc) => {
    console.log(`peerConnectionB 的应答 Answer 数据`);
    console.log(desc.sdp);
    console.log(`peerConnectionB 设置本地描述开始`);
    try {
      await peerConnectionB.setLocalDescription(desc);
      this.onSetLocalSuccess(peerConnectionB);
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }

    try {
      await peerConnectionA.setRemoteDescription(desc);
      this.onSetRemoteSuccess(peerConnectionA);
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }
  };

  onIceStateChangeA = (event) => {
    console.log(
      `peerConnectionA 连接的ICE状态: ${peerConnectionA.iceConnectionState}`
    );
    console.log("ICE 状态改变事件: ", event);
  };

  onIceStateChangeB = (event) => {
    console.log(
      `peerConnectionB 连接的ICE状态: ${peerConnectionB.iceConnectionState}`
    );
    console.log("ICE 状态改变事件: ", event);
  };

  onIceCandidateA = async (event) => {
    try {
      if (event.candidate) {
        // A 收到 candidate 信息, 发给B
        await peerConnectionB.addIceCandidate(event.candidate);
        this.onAddIceCandidateSuccess(peerConnectionB);
      }
    } catch (e) {
      this.onAddIceCandidateError(peerConnectionA, e);
    }

    console.log(
      `IceCandidate数据: \n${
        event.candidate ? event.candidate.candidate : "(null)"
      }`
    );
  };

  onIceCandidateB = async (event) => {
    try {
      if (event.candidate) {
        // B 收到 candidate 信息, 发给A
        await peerConnectionA.addIceCandidate(event.candidate);
        this.onAddIceCandidateSuccess(peerConnectionA);
      }
    } catch (e) {
      this.onAddIceCandidateError(peerConnectionB, e);
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
    peerConnectionA.close();
    peerConnectionB.close();
    peerConnectionA = null;
    peerConnectionB = null;
  };

  render() {
    return (
      <div className="container">
        <h1>
          <span>示例</span>
        </h1>
        <video
          ref="localVideo"
          controls
          loop
          muted
          playsInline
          onCanPlay={this.canPlay}
        >
          <source src="./assets/webrtc.mp4" type="video/mp4"></source>
        </video>

        <video ref="remoteVideo" playsInline autoPlay></video>

        <div>
          <Button onClick={this.call}>呼叫</Button>
          <Button onClick={this.hangup}>挂断</Button>
        </div>
      </div>
    );
  }
}

export default PeerConnectionVideo;
