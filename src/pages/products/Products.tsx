import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Image,
  Space,
  Spin,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import ProductsFilter from "./ProductFilter";
import type { FieldData, Product } from "../../type";
import { useEffect, useMemo, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createProduct, getProducts, updateProduct } from "../../http/api";
import { debounce } from "lodash";
import { PER_PAGE } from "../../constants";
import { useAuthStore } from "../../store";
import ProductForm from "./forms/ProductForm";
import { makeFormData } from "./helpers";

const columns = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
    render: (_text: string, record: Product) => {
      return (
        <div>
          <Space>
            <Image width={60} src={record.image} preview={false} />
            <Typography.Text>{record.name}</Typography.Text>
          </Space>
        </div>
      );
    },
  },

  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Status",
    dataIndex: "isPublish",
    key: "isPublish",
    render: (_: boolean, record: Product) => {
      return (
        <>
          {record.isPublish ? (
            <Tag color="green">Published</Tag>
          ) : (
            <Tag color="red">Draft</Tag>
          )}
        </>
      );
    },
  },
  {
    title: "CreatedAt",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => {
      return (
        <Typography.Text>
          {format(new Date(text), "dd/MM/yyyy HH:mm")}
        </Typography.Text>
      );
    },
  },
];

const Products = () => {
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();
  const { user } = useAuthStore();

  const [selectedProduct, setCurrentProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (selectedProduct) {
      setDrawerOpen(true);

      const priceConfiguration = Object.entries(
        selectedProduct.priceConfiguration
      ).reduce((acc, [key, value]) => {
        const stringifiedKey = JSON.stringify({
          configurationKey: key,
          priceType: value.priceType,
        });

        return {
          ...acc,
          [stringifiedKey]: value.availableOptions,
        };
      }, {});

      const attributes = selectedProduct.attributes.reduce((acc, item) => {
        return {
          ...acc,
          [item.name]: item.value,
        };
      }, {});

      form.setFieldsValue({
        ...selectedProduct,
        priceConfiguration,
        attributes,
        // todo: fix this
        categoryId: selectedProduct.category._id,
      });
    }
  }, [selectedProduct, form]);

  const [queryParams, setQueryParams] = useState({
    limit: PER_PAGE,
    page: 1,
    tenantId: user!.role === "manager" ? user?.tenant?.id : undefined,
  });

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    data: products,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );

      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();
      return getProducts(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const debouncedQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
    }, 500);
  }, []);

  const onFilterChange = (changedFields: FieldData[]) => {
    const changeFilterFields = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    if ("q" in changeFilterFields) {
      debouncedQUpdate(changeFilterFields.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changeFilterFields,
        page: 1,
      }));
    }
  };
  
  const queryClient = useQueryClient();
  const { mutate: productMutate, isPending } = useMutation({
    mutationKey: ["product"],
    mutationFn: async (data: FormData) => {
      if (selectedProduct) {
        //edit
        return updateProduct(data, selectedProduct._id).then((res) => res.data)
      } else {
        return createProduct(data).then((res) => res.data);
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      form.resetFields();
      setDrawerOpen(false);
      return;
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();

    // const dummy = {
    //   Size: {
    //     priceType: "base",
    //     availableOptions: { Small: 400, Medium: 600, Large: 800 },
    //   },
    //   Crust: {
    //     priceType: "additional",
    //     availableOptions: { Thin: 50, Thick: 100 },
    //   },
    // };

    // const currntData = {
    //   Size: {
    //     priceType: "base",
    //     availableOptions: { Small: 400, Medium: 600, Large: 800 },
    //   },
    //   Crust: {
    //     priceType: "additional",
    //     availableOptions: { Thin: 50, Thick: 100 },
    //   },
    // };

    const priceConfiguration = form.getFieldValue("priceConfiguration");
    const pricing = Object.entries(priceConfiguration).reduce(
      (acc, [key, value]) => {
        const parsedKey = JSON.parse(key);
        return {
          ...acc,
          [parsedKey.configurationKey]: {
            priceType: parsedKey.priceType,
            availableOptions: value,
          },
        };
      },
      {}
    );

    const categoryId = form.getFieldValue("categoryId");

    // const currentAttrs = {
    //   isHit: "No",
    //   Spiciness: "Less",
    // };

    // const attrs = [
    //   { name: "Is Hit", value: true },
    //   { name: "Spiciness", value: "Hot" },
    // ];

    const attributes = Object.entries(form.getFieldValue("attributes")).map(
      ([key, value]) => {
        return {
          name: key,
          value: value,
        };
      }
    );

    const postData = {
      ...form.getFieldsValue(),
      tenantId:
        user!.role === "manager"
          ? user?.tenant?.id
          : form.getFieldValue("tenantId"),
      isPublish: form.getFieldValue("isPublish") ? true : false,
      image: form.getFieldValue("image"),
      categoryId,
      priceConfiguration: pricing,
      attributes,
    };

    const formData = makeFormData(postData);
    await productMutate(formData);
  };

  return (
    <>
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Products" },
            ]}
          />
          {isFetching && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          )}
          {isError && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
        </Flex>

        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <ProductsFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setDrawerOpen(true);
              }}
            >
              Add Product
            </Button>
          </ProductsFilter>
        </Form>

        <Table
          columns={[
            ...columns,
            {
              title: "Action",
              render: (_, record: Product) => {
                return (
                  <Space>
                    <Button
                      type="link"
                      onClick={() => {
                        setCurrentProduct(record);
                      }}
                    >
                      Edit
                    </Button>
                  </Space>
                );
              },
            },
          ]}
          dataSource={products?.data}
          rowKey={"id"}
          pagination={{
            total: products?.total,
            pageSize: queryParams.limit,
            current: queryParams.page,
            onChange: (page) => {
              setQueryParams((prev) => {
                return {
                  ...prev,
                  page: page,
                };
              });
            },
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]}-${range[1]} of ${total} items`;
            },
          }}
        />

        <Drawer
          open={drawerOpen}
          title={selectedProduct ? "Update Product" : "Add Prodcut"}
          width={720}
          styles={{ body: { background: colorBgLayout } }}
          destroyOnHidden={true}
          onClose={() => {
            setCurrentProduct(null)
            setDrawerOpen(false);
            form.resetFields();
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setCurrentProduct(null)
                  setDrawerOpen(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={onHandleSubmit}
                type="primary"
                loading={isPending}
              >
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <ProductForm form={form} />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Products;
