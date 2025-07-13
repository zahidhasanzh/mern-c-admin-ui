import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  DatePicker,
  InputNumber,
} from "antd";
import type { Tenant } from "../../../type";
import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../../../http/api";
import { useAuthStore } from "../../../store";
import dayjs from "dayjs";

const PromoForm = () => {
  const { user } = useAuthStore();

  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () => {
      return getTenants(`perPage=100&currentPage=1`);
    },
  });

  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Card title="Promo Details">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: "Title is required",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Enter promo title" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Code"
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: "Promo code is required",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Enter promo code" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Valid Until"
                  name="validUpto"
                  rules={[
                    {
                      required: true,
                      message: "Valid upto date is required",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    size="large"
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Discount (%)"
                  name="discount"
                  rules={[
                    {
                      required: true,
                      message: "Discount is required",
                    },
                    {
                      type: "number",
                      min: 0,
                      max: 100,
                      message: "Discount must be between 0 and 100",
                    },
                  ]}
                >
                  <InputNumber
                    size="large"
                    min={0}
                    max={100}
                    style={{ width: "100%" }}
                    placeholder="Discount percentage"
                  />
                </Form.Item>
              </Col>

              {/* Tenant selection only for admin or roles other than manager */}
              {user?.role !== "manager" && (
                <Col span={24}>
                  <Form.Item
                    label="Tenant"
                    name="tenantId"
                    rules={[
                      {
                        required: true,
                        message: "Tenant is required",
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
              )}
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default PromoForm;
