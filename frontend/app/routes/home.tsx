import { useEffect, useState } from "react";
import List from "../../components/ui/list";
import useTodo from "../../hooks/todos/useTodo";
import { useForm, type FieldErrors } from "react-hook-form";
import { newTodoSchema, type newTodoForm } from "../../schemas/todoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../../components/ui/toast";
import { Button, Card, Checkbox, Form, Input, Pagination, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const {
    todos,
    addTodoMutation,
    editTodoMutation,
    toggleCompleteMutation,
    deleteTodoMutation,
    uploadAttachmentMutation,
    deleteAttachmentMutation,
    page,
    size,
    total,
    totalPages,
    completedFilter,
    setPage,
    setCompletedFilter,
    setSearchKeyword,
  } = useTodo();
  const [searchKeywordInput, setSearchKeywordInput] = useState("");

  useEffect(() => {
    const currentPage = window.location.search.split("page=")[1];
    if (currentPage) {
      setPage(Number(currentPage));
    }
  }, [setPage]);

  const { register, handleSubmit, watch, reset } = useForm<newTodoForm>({
    resolver: zodResolver(newTodoSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
    },
  });

  const title = watch("title");

  const onSubmit = (data: newTodoForm) => {
    addTodoMutation.mutate(data.title);
    reset();
  };

  const onInvalid = (errors: FieldErrors<newTodoForm>) => {
    const firstErrorMessage = Object.values(errors)[0]?.message || t("home.noError");
    toast.error(firstErrorMessage);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">

        <Card>
          <Typography.Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
            {t("home.title")}
          </Typography.Title>

          <Space orientation="vertical" size="large" style={{ width: "100%" ,gap: 14}}>
            <Input.Search
              enterButton={t("common.search")}
              onChange={(e) => setSearchKeywordInput(e.target.value)}
              onSearch={() => setSearchKeyword(searchKeywordInput)}
              placeholder={t("home.searchPlaceholder")}
              size="large"
              value={searchKeywordInput}
            />

            <Checkbox
              checked={completedFilter === true}
              onChange={(e) => setCompletedFilter(e.target.checked ? true : undefined)}
            >
              {t("home.showCompletedOnly")}
            </Checkbox>

            <Form onFinish={handleSubmit(onSubmit, onInvalid)} style={{ marginTop: 5 }}>
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  {...register("title")}
                  placeholder={t("home.addPlaceholder")}
                  size="large"
                />
                <Button
                  size="large"
                  disabled={!title?.trim() || addTodoMutation.isPending}
                  htmlType="submit"
                  type="primary"
                >
                  {t("common.add")}
                </Button>
              </Space.Compact>
            </Form>

            <List
              items={todos}
              onToggleComplete={(id) => toggleCompleteMutation.mutate(id)}
              onDelete={(id) => deleteTodoMutation.mutate(id)}
              onEdit={(id, title) => editTodoMutation.mutate({ id, title })}
              onUploadAttachment={(id, file) => uploadAttachmentMutation.mutate({ todoId: id, file })}
              onDeleteAttachment={(todoId, attachmentId) =>
                deleteAttachmentMutation.mutate({ todoId, attachmentId })
              }
              uploadingTodoId={
                uploadAttachmentMutation.isPending
                  ? uploadAttachmentMutation.variables?.todoId
                  : undefined
              }
              deletingAttachmentId={
                deleteAttachmentMutation.isPending
                  ? deleteAttachmentMutation.variables?.attachmentId
                  : undefined
              }
            />
            <Pagination
              align="center"
              current={page}
              onChange={setPage}
              pageSize={size}
              total={total}
            />
          </Space>
        </Card>
      </div>
    </main>
  );
}
