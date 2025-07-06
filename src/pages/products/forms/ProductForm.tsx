import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
  type FormInstance,
} from "antd";
import type { Category, Tenant } from "../../../type";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getTenants } from "../../../http/api";

import Pricing from "./Pricing";
import Attributes from "./Attributes";
import ProductImage from "./ProductImage";
import { useAuthStore } from "../../../store";

const ProductForm = ({form}: {form: FormInstance}) => {
  const selectedCategory = Form.useWatch("categoryId");

  const { user } = useAuthStore();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return getCategories();
    },
  });

  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () => {
      return getTenants(`perPage=100&currentPage=1`);
    },
  });

  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size="large">
          <Card title="Product info">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Product name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Product name is required",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Category"
                  name="categoryId"
                  rules={[
                    {
                      required: true,
                      message: "Category is required",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    onChange={() => {}}
                    style={{ width: "100%" }}
                    placeholder={"Select Category"}
                    allowClear={true}
                    options={categories?.data?.map((category: Category) => ({
                      value: category._id,
                      label: category.name,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Description is required",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={2}
                    maxLength={100}
                    style={{ resize: "none" }}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Product image">
            <Row gutter={20}>
              <Col span={12}>
                <ProductImage initialImage={form.getFieldValue('image')}/>
              </Col>
            </Row>
          </Card>

          {user?.role !== "manager" && (
            <Card title="Tenant info">
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    label="Restaurant"
                    name="tenantId"
                    rules={[
                      {
                        required: true,
                        message: "Restaurant is required",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      onChange={() => {}}
                      style={{ width: "100%" }}
                      placeholder={"Select Restaurant"}
                      allowClear={true}
                      options={restaurants?.data.data?.map(
                        (tenant: Tenant) => ({
                          value: String(tenant.id),
                          label: tenant.name,
                        })
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          )}

          {selectedCategory && <Pricing selectedCategory={selectedCategory} />}
          {selectedCategory && (
            <Attributes selectedCategory={selectedCategory} />
          )}

          <Card title="Other properties">
            <Row gutter={24}>
              <Col span={24}>
                <Space>
                  <Form.Item name="isPublish">
                    <Switch
                      defaultChecked={false}
                      onChange={() => {}}
                      checkedChildren="yes"
                      unCheckedChildren="no"
                    />
                  </Form.Item>
                  <Typography.Text
                    style={{ marginBottom: 22, display: "block" }}
                  >
                    Published
                  </Typography.Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default ProductForm;
