import attachmentService from '../services/attachment.service.js';
import asyncHandle from '../utils/asyncHandle.js';
import { successResponse } from '../utils/mappers/response.mapper.js';
import { toAttachmentDto } from '../utils/mappers/todo.mapper.js';

const addAttachment = asyncHandle(async (req, res, next) => {
  const userId = req.user.userId;
  const attachment = await attachmentService.addAttachment(req.params.id, userId, req.file);

  return res.status(201).json(successResponse(toAttachmentDto(attachment), 'ATTACHMENT_SUCCESS'));
});

const getTodoAttachments = asyncHandle(async (req, res, next) => {
  const userId = req.user.userId;
  const attachments = await attachmentService.getTodoAttachments(req.params.id, userId);

  return res.json(successResponse(attachments.map(toAttachmentDto)));
});

const deleteAttachment = asyncHandle(async (req, res, next) => {
  const userId = req.user.userId;
  await attachmentService.deleteAttachment(req.params.id, req.params.attachmentId, userId);

  return res.status(204).send();
});

export default {
  addAttachment,
  getTodoAttachments,
  deleteAttachment,
};
