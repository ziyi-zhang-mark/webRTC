import React from "react";
import { List } from "antd";
import { Link } from "react-router-dom";

const data = [{ title: "Home Page", path: "/" }];

class Samples extends React.Component {
  render() {
    return (
      <div>
        <List
          header={<div>WebRTC samples</div>}
          footer={<div>Footer</div>}
          boardered
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
