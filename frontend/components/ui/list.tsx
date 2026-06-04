import { Button, Card, Empty, Input, List as AntList, Space, Tag, Typography, Upload } from "antd";
import { useTranslation } from "react-i18next";
import type { Todo } from "../../types/todo";

interface ListProps {
  items: Todo[];
  onEdit: (id: string, newTitle: string) => void;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUploadAttachment: (id: string, file: File) => void;
  onDeleteAttachment: (todoId: string, attachmentId: number) => void;
  uploadingTodoId?: string;
  deletingAttachmentId?: number;
}

export default function List({
  items,
  onEdit,
  onToggleComplete,
  onDelete,
  onUploadAttachment,
  onDeleteAttachment,
  uploadingTodoId,
  deletingAttachmentId,
}: ListProps) {
  const { t } = useTranslation();

  return (
    <AntList
      dataSource={items}
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
      renderItem={(item) => {
        const isUploadingAttachment = uploadingTodoId === item.id;
        const createdAt = item.createdAt ? new Date(item.createdAt) : null;

        return (
          <AntList.Item style={{ paddingInline: 0 }}>
            <Card
              style={{
                background: item.completed ? "#f6ffed" : "#fff",
                borderColor: item.completed ? "#b7eb8f" : "#f0f0f0",
                width: "100%",
              }}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <Space orientation="vertical" size="small" style={{ minWidth: 0, width: "100%" }}>
                  <Input
                    type="text"
                    value={item.title}
                    onChange={(e) => onEdit(item.id, e.target.value)}
                    variant="borderless"
                    style={{ fontSize: 18, fontWeight: 600, paddingInline: 0 }}
                  />
                  {createdAt && !Number.isNaN(createdAt.getTime()) && (
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      <time dateTime={item.createdAt}>
                        {createdAt.toLocaleString("vi-VN")}
                      </time>
                    </Typography.Text>
                  )}

                  <Space size={[8, 8]} wrap>
                    {item.attachments?.map((attachment) => {
                      const isDeletingAttachment = deletingAttachmentId === attachment.id;

                      return (
                        <Tag
                          key={attachment.id}
                          closable
                          closeIcon={isDeletingAttachment ? "..." : undefined}
                          onClose={(event) => {
                            event.preventDefault();

                            if (!isDeletingAttachment) {
                              onDeleteAttachment(item.id, attachment.id);
                            }
                          }}
                          style={{background: isDeletingAttachment ? "#f5f5f5" : "#ffffff", border: isDeletingAttachment ? "1px solid #d9d9d9" : "1px solid #0088ff"}}
                        >
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noreferrer"
                            title={attachment.name}
                            style={{ color: "#0088ff" }}
                          >
                            {attachment.name}
                          </a>
                        </Tag>
                      );
                    })}

                    <Upload
                      beforeUpload={(file) => {
                        if (!isUploadingAttachment) {
                          onUploadAttachment(item.id, file);
                        }

                        return false;
                      }}
                      disabled={isUploadingAttachment}
                      maxCount={1}
                      showUploadList={false}
                    >
                      <Button disabled={isUploadingAttachment} size="small">
                        {isUploadingAttachment ? "..." : "+"}
                      </Button>
                    </Upload>
                  </Space>
                </Space>

                <Space>
                  <Button
                    onClick={() => onToggleComplete(item.id)}
                    style={{ borderColor: "#52c41a", color: "#389e0d" }}
                  >
                    {item.completed ? t("todo.done") : t("todo.markComplete")}
                  </Button>
                  <Button danger onClick={() => onDelete(item.id)}>
                    {t("todo.delete")}
                  </Button>
                </Space>
              </div>
            </Card>
          </AntList.Item>
        );
      }}
      style={{ marginTop: 20 }}
    />
  );
}
