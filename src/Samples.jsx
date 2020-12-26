import React from "react";
import { List } from "antd";
import { Link } from "react-router-dom";

const data = [
  { title: "首页", path: "/" },
  { title: "摄像头示例", path: "/camera" },
  { title: "麦克风示例", path: "/microphone" },
  { title: "截取视频示例", path: "/canvas" },
  { title: "屏幕共享示例", path: "/screenShare" },
  { title: "视频滤镜示例", path: "/videoFilter" },
  { title: "视频分辨率示例", path: "/resolution" },
  { title: "音量检测示例", path: "/audioVolume" },
  { title: "设备枚举示例", path: "/deviceSelect" },
  { title: "设置综合示例", path: "/mediaSettings" },
  { title: "mediaStreamAPI 测试", path: "/mediaStreamAPI" },
  { title: "捕获Video作为MediaStream实例", path: "/captureVideo" },
  { title: "捕获Canvas作为MediaStream实例", path: "/captureCanvas" },
  { title: "录制音频示例", path: "/recordAudio" },
  { title: "录制视频示例", path: "/recordVideo" },
  { title: "录制屏幕示例", path: "/recordScreen" },
  { title: "录制Canvas示例", path: "/recordCanvas" },
];

class Samples extends React.Component {
  render() {
    return (
      <div>
        <List
          header={<div>WebRTC samples</div>}
          footer={<div>Footer</div>}
          boardered="true"
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Link to={item["path"]}>{item["title"]}</Link>
            </List.Item>
          )}
        ></List>
      </div>
    );
  }
}

export default Samples;
