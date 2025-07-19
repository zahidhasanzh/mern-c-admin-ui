import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Flex,
  List,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { capitalizeFirst } from "../products/helpers";
import { colorMapping } from "../../constants";
import { useQuery } from "@tanstack/react-query";
import { getSingle } from "../../http/api";
import type { Order } from "../../type";
import { format } from "date-fns";

const SingleOrder = () => {
  const params = useParams();
  const orderId = params.orderId;

  const { data: order } = useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: () => {
      const queryString = new URLSearchParams({
        // todo: think about maybe trim the whitespace.
        fields:
          "cart,address,paymentMode,tenantId,total,comment,orderStatus,paymentStatus,createdAt",
      }).toString();
      return getSingle(orderId as string, queryString).then((res) => res.data);
    },
  });
  if (!order) return null;

  return (
    <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
      <Flex justify="space-between">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: <Link to="/orders">Orders</Link> },
            { title: `Order #${order?._id}` },
          ]}
        />
      </Flex>

      <Row gutter={24}>
        <Col span={14}>
          <Card
            title="Order Details"
            extra={
              <Tag
                bordered={false}
                color={colorMapping[order.orderStatus] ?? "processing"}
              >
                {capitalizeFirst(order.orderStatus)}
              </Tag>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={order.cart}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={`${item.image}`} />}
                    title={item.name}
                    description={item.chosenConfiguration.selectedToppings
                      // todo: IMPORTANT: check why there is a nested array in selected toppings
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      .map((topping) => topping.name)
                      .join(", ")}
                  />

                  <Space size={"large"}>
                    <Typography.Text>
                      {Object.values(
                        item.chosenConfiguration.priceConfiguration
                      ).join(", ")}
                    </Typography.Text>
                    <Typography.Text>
                      {item.qty} Item{item.qty > 1 ? "s" : ""}
                    </Typography.Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="Customer Details">
            <Space direction="vertical">
              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">Name</Typography.Text>
                <Typography.Text>
                  {order.customerId.firstName + " " + order.customerId.lastName}
                </Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">Address</Typography.Text>
                <Typography.Text>{order.address}</Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">
                  Payment Method
                </Typography.Text>
                <Typography.Text>
                  {order.paymentMode.toUpperCase()}
                </Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">
                  Payment Status
                </Typography.Text>
                <Typography.Text>
                  {capitalizeFirst(order.paymentStatus)}
                </Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">Order Amount</Typography.Text>
                <Typography.Text>${order.total}</Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">Order Time</Typography.Text>
                <Typography.Text>
                  {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
                </Typography.Text>
              </Flex>

              {order.comment && (
                <Flex style={{ flexDirection: "column" }}>
                  <Typography.Text type="secondary">Comment</Typography.Text>
                  <Typography.Text>
                    {order.comment}
                  </Typography.Text>
                </Flex>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default SingleOrder;
