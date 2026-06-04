function toIsoString(value) {
  return value instanceof Date ? value.toISOString() : value;
}

function toAttachmentDto(attachment) {
  if (!attachment) {
    return null;
  }

  return {
    id: attachment.id,
    todoId: attachment.todoId,
    name: attachment.name,
    url: attachment.url,
    publicId: attachment.publicId,
    resourceType: attachment.resourceType,
    format: attachment.format,
    bytes: attachment.bytes,
    createdAt: toIsoString(attachment.createdAt),
  };
}

function toTodoDto(todo) {
  if (!todo) {
    return null;
  }

  const dto = {
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    createdAt: toIsoString(todo.createdAt),
    updatedAt: toIsoString(todo.updatedAt),
  };

  if (Array.isArray(todo.attachments)) {
    dto.attachments = todo.attachments.map(toAttachmentDto);
  }

  return dto;
}

function toPaginatedTodosDto(result) {
  return {
    ...result,
    items: result.items.map(toTodoDto),
  };
}

export {
  toAttachmentDto,
  toPaginatedTodosDto,
  toTodoDto,
};
