import {
  Button,
  Card,
  Col,
  List,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography,
  message,
} from "antd";
import Icon from "@ant-design/icons";
import { useAuthStore } from "../store";
import { BarChartIcon } from "../components/icons/BarChart";
import { Link } from "react-router-dom";
import BasketIcon from "../components/icons/BasketIcon";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../http/api";


const { Title, Text } = Typography;

interface Order {
  _id: string;
  address: string;
  comment?: string;
  orderStatus: string;
  total: number;
  createdAt: string;
  paymentMode: string;
  customerId?: {
    firstName: string;
    lastName: string;
  };
}

interface CardTitleProps {
  title: string;
  PrefixIcon: React.ComponentType<unknown>;
}

const CardTitle = ({ title, PrefixIcon }: CardTitleProps) => (
  <Space>
    <Icon component={PrefixIcon} />
    {title}
  </Space>
);

function HomePage() {
  const { user } = useAuthStore();
  const [messageApi, contextHolder] = message.useMessage();

  // TenantId from user or fallback
  const TENANT_ID = user?.tenant?.id ?? 1;

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ["orders", TENANT_ID],
    queryFn: async () => {
      const queryString = new URLSearchParams({
        tenantId: String(TENANT_ID),
        limit: "6", // limit to recent 5 orders
      }).toString();
      const res = await getOrders(queryString);
      return res.data as Order[];
    },
  });

  if (isError) {
    messageApi.error("Failed to load recent orders.");
  }

  return (
    <>
      {contextHolder}
      <div>
        <Title level={4}>Welcome, {user?.firstName} 😀</Title>

        <Row className="mt-4" gutter={16}>
          <Col span={12}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card>
                  <Statistic title="Total orders" value={orders?.length ?? 0} />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="Total sale"
                    value={orders?.reduce((acc, o) => acc + o.total, 0) ?? 0}
                    precision={2}
                    prefix="$"
                  />
                </Card>
              </Col>
              <Col span={24}>
                <Card
                  title={<CardTitle title="Sales" PrefixIcon={BarChartIcon} />}
                >
                  {/* TODO: Add chart here */}
                </Card>
              </Col>
            </Row>
          </Col>

          <Col span={12}>
            <Card
              title={<CardTitle title="Recent orders" PrefixIcon={BasketIcon} />}
            >
              {isLoading ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : (
                <List
                  className="demo-loadmore-list"
                  itemLayout="horizontal"
                   dataSource={orders ? orders.slice(0, 6) : []}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <Link to={`/orders/${item._id}`}>
                            {item.customerId
                              ? `${item.customerId.firstName} ${item.customerId.lastName}`
                              : "Unknown Customer"}
                          </Link>
                        }
                        description={item.address}
                      />
                      <Row style={{ flex: 1 }} justify="space-between" align="middle">
                        <Col>
                          <Text strong>${item.total.toFixed(2)}</Text>
                        </Col>
                        <Col>
                          <Tag color="volcano">{item.orderStatus}</Tag>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
              )}

              <div style={{ marginTop: 20 }}>
                <Button type="link">
                  <Link to="/orders">See all orders</Link>
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default HomePage;
