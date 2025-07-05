import { Card, Col, Form, Input, InputNumber, Row, Space, Typography } from "antd";

import type { Category } from "../../../type";
type PricingProps = {
  selectedCategory: string;
};
const Pricing = ({ selectedCategory }: PricingProps) => {
  const category: Category | null = selectedCategory
    ? JSON.parse(selectedCategory)
    : null;
  if (!category) {
    return null;
  }

  return (
    <Card title={<Typography.Text>Product price</Typography.Text>}>
      {Object.entries(category?.priceConfiguration).map(
        ([configrationKey, configrationValue]) => {
          return (
            <div key={configrationKey}>
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <Typography.Text>{`${configrationKey} (${configrationValue.priceType})`}</Typography.Text>

                <Row gutter={20}>
                  {configrationValue.availableOptions.map((opiton: string) => {
                    return (
                      <Col span={8} key={opiton}>
                        <Form.Item
                          label={opiton}
                          name={[
                            "priceConfiguration",
                            JSON.stringify({
                              configrationKey: configrationKey,
                              priceType: configrationValue.priceType,
                             }),
                             opiton
                          ]}
                        >

                          <InputNumber addonAfter="$"/>
                        </Form.Item>
                      </Col>
                    );
                  })}
                </Row>
              </Space>
            </div>
          );
        }
      )}
    </Card>
  );
};

export default Pricing;
