import { registerEnumType } from '@nestjs/graphql';
import { TaskPriority, TaskStatus } from '@prisma/client';

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
});

registerEnumType(TaskPriority, {
  name: 'TaskPriority',
});

export { TaskStatus, TaskPriority };
