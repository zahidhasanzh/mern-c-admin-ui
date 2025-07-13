import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import {
  PlusOutlined,
  LoadingOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPromos,
  updatePromo,
  createPromo,
  deletePromo,
} from "../../http/api";
import type { Promo, PromoPayload } from "../../type";
import PromoForm from "./forms/PromoForm";
import PromoFilter from "./forms/PromoFilter";
import { debounce } from "lodash";
import { PER_PAGE } from "../../constants";
import type { FieldData } from "rc-field-form/lib/interface";
import { useAuthStore } from "../../store";

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "Valid Upto",
    dataIndex: "validUpto",
    key: "validUpto",
    render: (text: string) => new Date(text).toLocaleDateString(),
  },
  {
    title: "Discount",
    dataIndex: "discount",
    key: "discount",
    render: (value: number) => `${value}%`,
  },
  {
    title: "Tenant ID",
    dataIndex: "tenantId",
    key: "tenantId",
  },
];

const Promos = () => {
  const { user } = useAuthStore();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);

  const queryClient = useQueryClient();

  const [queryParams, setQueryParams] = useState({
    limit: PER_PAGE,
    page: 1,
    tenantId: user?.role === "manager" ? String(user?.tenant?.id) : undefined,
  });

  const {
    data: promos,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["promos", queryParams],
    queryFn:  () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );

      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();
      return getPromos(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  console.log(promos);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: PromoPayload) => {
      return selectedPromo
        ? updatePromo(selectedPromo._id, data).then((res) => res.data)
        : createPromo(data).then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promos"] });
      form.resetFields();
      setDrawerOpen(false);
      setSelectedPromo(null);
    },
  });

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deletePromo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promos"] });
    },
  });

  const handleSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    mutate(values);
  };

  const handleEdit = (promo: Promo) => {
    setSelectedPromo(promo);
  };

  const handleDelete = (id: string) => {
    deleteMutate(id);
  };

  useEffect(() => {
    if (selectedPromo) {
      form.setFieldsValue({
        ...selectedPromo,
        validUpto: selectedPromo.validUpto && dayjs(selectedPromo.validUpto),
      });
      setDrawerOpen(true);
    }
  }, [selectedPromo, form]);

  // Debounced 
    const debouncedQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
    }, 500);
  }, []);

  // On Filter Form Change
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
    console.log("changefield", changeFilterFields);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Flex justify="space-between">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: "Promos" },
          ]}
        />
        {isFetching && <Spin indicator={<LoadingOutlined spin />} />}
        {isError && (
          <Typography.Text type="danger">
            {(error as Error).message}
          </Typography.Text>
        )}
      </Flex>

      <Form form={filterForm} onFieldsChange={onFilterChange}>
        <PromoFilter>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setDrawerOpen(true);
              setSelectedPromo(null);
            }}
          >
            Add Promo
          </Button>
        </PromoFilter>
      </Form>

      <Table
        columns={[
          ...columns,
          {
            title: "Action",
            key: "action",
            render: (_, record: Promo) => (
              <Space>
                <Button type="link" onClick={() => handleEdit(record)}>
                  Edit
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => handleDelete(record._id)}
                  loading={isDeleting}
                >
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
        dataSource={promos?.data}
        rowKey={"_id"}
        pagination={{
          total: promos?.total,
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
        title={selectedPromo ? "Edit Promo" : "Add Promo"}
        open={drawerOpen}
        width={600}
        onClose={() => {
          form.resetFields();
          setSelectedPromo(null);
          setDrawerOpen(false);
        }}
        extra={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" loading={isPending} onClick={handleSubmit}>
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <PromoForm />
        </Form>
      </Drawer>
    </Space>
  );
};

export default Promos;
