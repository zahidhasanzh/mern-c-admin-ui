import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { getTenants } from "../../../http/api";
import { useQuery } from "@tanstack/react-query";
import type { Tenant } from "../../../type";

const UserForm = () => {
  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => {
      return getTenants().then((res) => res.data.data);
    },
  });
  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size="large">
          <Card title="Basic info">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="First name" name="firstName" rules={[
                  {
                    required: true,
                    message: 'First name is required'
                  }
                ]}>
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Last name" name="lastName"  rules={[
                  {
                    required: true,
                    message: 'Last name is required'
                  }
                ]}>
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email" name="email"  rules={[
                  {
                    required: true,
                    message: 'Email is required'
                  },
                  {
                    type: "email",
                    message: "Email is not valid"
                  }
                ]}>
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Security info">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="Password" name="password"  rules={[
                  {
                    required: true,
                    message: 'Password is required'
                  }
                ]}>
                  <Input size="large" type="password" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Role">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="Role" name="role"  rules={[
                  {
                    required: true,
                    message: 'Role is required'
                  }
                ]}>
                  <Select
                    size="large"
                    onChange={() => {}}
                    style={{ width: "100%" }}
                    placeholder={"Select role"}
                    allowClear={true}
                    options={[
                      { value: "admin", label: "Admin" },
                      { value: "manager", label: "Manager" },
                      { value: "customer", label: "Customer" },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Restaurant" name="tenantId"  rules={[
                  {
                    required: true,
                    message: 'Restaurant is required'
                  }
                ]}>
                  <Select
                    size="large"
                    onChange={() => {}}
                    style={{ width: "100%" }}
                    placeholder={"Select role"}
                    allowClear={true}
                    options={tenants.map((tenant: Tenant) => (
                     {value: tenant.id, label: tenant.name}
                  ))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default UserForm;
