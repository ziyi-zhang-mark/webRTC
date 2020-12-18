import React from "react";
import { List } from "antd";
import { Link } from "react-router-dom";

const data = [
  { title: "首页", path: "/" },
  { title: "摄像头示例", path: "/camera" },
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
