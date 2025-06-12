import { Button, Card, Col, Input, Row, Select } from "antd";
import {PlusOutlined} from "@ant-design/icons"
const UserFilter = () => {
  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={16}>
          <Row gutter={20}>
            <Col span={8}>
              <Input.Search placeholder="Search" />
            </Col>
            <Col span={8}>
              <Select
                style={{ width: "100%" }}
                placeholder={"Select role"}
                allowClear={true}
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "manager", label: "Manager" },
                  { value: "customer", label: "Customer" },
                ]}
              />
            </Col>
            <Col span={8}>
              <Select
                placeholder={"Status"}
                style={{ width: "100%" }}
                allowClear={true}
                options={[
                  { value: "ban", label: "Ban" },
                  { value: "active", label: "Active" },
                ]}
              />
            </Col>
          </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
         <Button type="primary" icon={<PlusOutlined/>}>Add User</Button>
        </Col>
      </Row>
    </Card>
  );
};

export default UserFilter;
