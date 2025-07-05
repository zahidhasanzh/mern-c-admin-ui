import { useQuery } from "@tanstack/react-query";
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
} from "antd";
import { getCategories, getTenants } from "../../http/api";
import type { Category, Tenant } from "../../type";
import { useAuthStore } from "../../store";
type ProductsFilterProps = {
  children?: React.ReactNode;
};
const ProductsFilter = ({ children }: ProductsFilterProps) => {
  const {user} = useAuthStore()
  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () => {
      return getTenants(`perPage=100&currentPage=1`);
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return getCategories();
    },
  });

  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={16}>
          <Row gutter={20}>
            <Col span={6}>
              <Form.Item name="q" style={{ marginBottom: 0 }}>
                <Input.Search allowClear={true} placeholder="Search" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="categoryId" style={{ marginBottom: 0 }}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select category"
                  allowClear={true}
                  options={categories?.data.map((category: Category) => ({
                    value: category._id,
                    label: category.name,
                  }))}
                />
              </Form.Item>
            </Col>

            {user!.role === "admin" && (
              <Col span={6}>
                <Form.Item name="tenantId" style={{ marginBottom: 0 }}>
                  <Select
                    style={{ width: "100%" }}
                    placeholder={"Select restaurant"}
                    allowClear={true}
                    options={restaurants?.data.data.map(
                      (restaurant: Tenant) => ({
                        value: restaurant.id,
                        label: restaurant.name,
                      })
                    )}
                  />
                </Form.Item>
              </Col>
            )}

            <Col span={6}>
              <Space>
                <Form.Item name="isPublish">
                  <Switch defaultChecked={false} onChange={() => {}} />
                </Form.Item>
                <Typography.Text style={{marginBottom: 22, display: 'block'}}>Show only published</Typography.Text>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default ProductsFilter;
