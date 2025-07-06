import { Form, Space, Typography, Upload, message, type UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const ProductImage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const uploaderConfig: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      //validation logic
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        console.error("you can upload JPG/PNG file!");
        messageApi.error("you can only upload JPG/PNG file!");
      }

      //size validation
      setImageUrl(URL.createObjectURL(file));
      return false;
    },
  };

  return (
    <Form.Item
      label=""
      name="image"
      rules={[
        {
          required: true,
          message: "Please upload a product image",
        },
      ]}
    >

      <Upload listType="picture-card" {...uploaderConfig}>
              {contextHolder}
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
        ) : (
          <Space direction="vertical">
            <PlusOutlined />
            <Typography.Text>Upload</Typography.Text>
          </Space>
        )}
      </Upload>
    </Form.Item>
  );
};

export default ProductImage;
