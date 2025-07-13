import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
} from "antd";
import { useAuthStore } from "../../../store";
import { getTenants } from "../../../http/api";
import type { Tenant } from "../../../type";



type PromoFilterProps = {
  children?: React.ReactNode;
};

const PromoFilter = ({ children }: PromoFilterProps) => {
  const { user } = useAuthStore();

  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () => getTenants(`perPage=100&currentPage=1`),
  });

  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={8}>
              <Form.Item name="q" style={{ marginBottom: 0 }}>
                <Input.Search
                  allowClear
                  placeholder="Search by title or code"
                />
              </Form.Item>
            </Col>

            {user?.role === "admin" && (
              <Col span={8}>
                <Form.Item name="tenantId" style={{ marginBottom: 0 }}>
                  <Select
                    placeholder="Select restaurant"
                    style={{ width: "100%" }}
                    allowClear
                    options={restaurants?.data.data.map((tenant: Tenant) => ({
                      value: tenant.id,
                      label: tenant.name,
                    }))}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Col>

        <Col span={8} style={{ display: "flex", justifyContent: "flex-end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default PromoFilter;
