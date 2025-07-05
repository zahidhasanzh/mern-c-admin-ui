import { Breadcrumb, Flex, Space } from "antd";
import { Link } from "react-router-dom";
import {
  LoadingOutlined,
  RightOutlined,
} from "@ant-design/icons";

const Products = () => {
  return (
    <>
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Products" },
            ]}
          />
        </Flex>
      </Space>
    </>
  );
};

export default Products;
