import { Readable } from 'stream';
import createHttpError from 'http-errors';
import cloudinary from '../configs/cloudinary.config.js';
import prisma from '../libs/prisma.js';

async function getOwnedTodo(todoId, userId) {
  const todo = await prisma.todo.findFirst({
    where: { id: todoId, userId },
  });

  if (!todo) {
    throw createHttpError(404, 'TODO_NOT_FOUND');
  }

  return todo;
}

function uploadToCloudinary(file, todoId) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `todos/${todoId}`,
        resource_type: 'auto',
        public_id: `${Date.now()}_${file.originalname}`,
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      },
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
}

async function addAttachment(todoId, userId, file) {
  if (!file) {
    throw createHttpError(400, 'ATTACHMENT_REQUIRED');
  }

  await getOwnedTodo(todoId, userId);

  const uploadedFile = await uploadToCloudinary(file, todoId);

  return prisma.attachment.create({
    data: {
      todoId,
      name: file.originalname,
      url: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
      resourceType: uploadedFile.resource_type,
      format: uploadedFile.format,
      bytes: uploadedFile.bytes,
    },
  });
}

async function getTodoAttachments(todoId, userId) {
  await getOwnedTodo(todoId, userId);

  return prisma.attachment.findMany({
    where: { todoId },
    orderBy: { createdAt: 'desc' },
  });
}

async function deleteAttachment(todoId, attachmentId, userId) {
  await getOwnedTodo(todoId, userId);

  const attachment = await prisma.attachment.findFirst({
    where: {
      id: Number(attachmentId),
      todoId,
    },
  });

  if (!attachment) {
    throw createHttpError(404, 'ATTACHMENT_NOT_FOUND');
  }

  await cloudinary.uploader.destroy(attachment.publicId, {
    resource_type: attachment.resourceType,
  });

  await prisma.attachment.delete({
    where: { id: attachment.id },
  });
}

export default {
  addAttachment,
  getTodoAttachments,
  deleteAttachment,
};
