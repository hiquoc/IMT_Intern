import type { Todo } from "../../types/todo";
import Button from "./button";

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
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => {
        const isUploadingAttachment = uploadingTodoId === item.id;

        return (
          <li
            key={item.id}
            className={`rounded-md border p-4 shadow-sm transition ${
              item.completed
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-white hover:border-blue-200"
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => onEdit(item.id, e.target.value)}
                  className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-lg font-medium text-gray-900 outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {item.attachments?.map((attachment) => {
                    const isDeletingAttachment = deletingAttachmentId === attachment.id;

                    return (
                      <span
                        key={attachment.id}
                        className={`inline-flex max-w-full items-center overflow-hidden rounded-md border border-gray-200 bg-gray-50 text-sm ${
                          isDeletingAttachment ? "opacity-70" : ""
                        }`}
                      >
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="max-w-56 truncate px-2 py-1 text-blue-700 hover:underline"
                          title={attachment.name}
                        >
                          {attachment.name}
                        </a>
                        <button
                          type="button"
                          onClick={() => onDeleteAttachment(item.id, attachment.id)}
                          disabled={isDeletingAttachment}
                          className="min-w-8 border-l border-gray-200 px-2 py-1 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                          aria-label={`Remove ${attachment.name}`}
                          title="Remove attachment"
                        >
                          {isDeletingAttachment ? "..." : "x"}
                        </button>
                      </span>
                    );
                  })}

                  <label
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-md border border-dashed border-blue-300 bg-blue-50 text-lg font-semibold leading-none text-blue-600 hover:border-blue-400 hover:bg-blue-100 ${
                      isUploadingAttachment
                        ? "cursor-not-allowed opacity-70"
                        : "cursor-pointer"
                    }`}
                    title="Add attachment"
                    aria-busy={isUploadingAttachment}
                  >
                    {isUploadingAttachment ? "..." : "+"}
                    <input
                      type="file"
                      className="hidden"
                      disabled={isUploadingAttachment}
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file && !isUploadingAttachment) {
                          onUploadAttachment(item.id, file);
                          e.target.value = "";
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button color="green" onClick={() => onToggleComplete(item.id)} className="text-sm">
                  {item.completed ? "Đã xong" : "Hoàn thành"}
                </Button>
                <Button color="red" onClick={() => onDelete(item.id)} className="text-sm">
                  Xóa
                </Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
