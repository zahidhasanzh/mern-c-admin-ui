import { Breadcrumb, Button, Flex, Form, Space } from "antd";
import { Link } from "react-router-dom";
import {
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import ProductsFilter from "./ProductFilter";


const Products = () => {
  const [filterForm] = Form.useForm();
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

        <Form form={filterForm} onFieldsChange={() => {}}>
          <ProductsFilter>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {}}>
              Add Product
            </Button>
          </ProductsFilter>
        </Form>
      </Space>
    </>
  );
};

export default Products;
