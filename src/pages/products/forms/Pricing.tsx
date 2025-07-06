import { Card, Col, Form, InputNumber, Row, Space, Typography } from "antd";

import type { Category } from "../../../type";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../../http/api";
type PricingProps = {
  selectedCategory: string;
};
const Pricing = ({ selectedCategory }: PricingProps) => {
  const { data: fetchedCategory } = useQuery<Category>({
    queryKey: ["category", selectedCategory],
    queryFn: () => {
      return getCategory(selectedCategory).then((res) => res.data);
    },
    staleTime: 1000 * 5 // 5 minutes
  });

  if(!fetchedCategory){
    return null
  }


  return (
    <Card title={<Typography.Text>Product price</Typography.Text>}>
      {Object.entries(fetchedCategory?.priceConfiguration).map(
        ([configurationKey, configurationValue]) => {
          return (
            <div key={configurationKey}>
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <Typography.Text>{`${configurationKey} (${configurationValue.priceType})`}</Typography.Text>

                <Row gutter={20}>
                  {configurationValue.availableOptions.map((opiton: string) => {
                    return (
                      <Col span={8} key={opiton}>
                        <Form.Item
                          label={opiton}
                          name={[
                            "priceConfiguration",
                            JSON.stringify({
                              configurationKey: configurationKey,
                              priceType: configurationValue.priceType,
                            }),
                            opiton,
                          ]}
                        >
                          <InputNumber addonAfter="$" />
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
