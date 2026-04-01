import type { TaskStatus } from '@/entities/task/model/types';
import { taskStatusLabels, taskStatusOrder } from '@/entities/task/model/task-meta';
import { Field } from '@/shared/ui/Field';
import { Select } from '@/shared/ui/Select';

type StatusSelectProps = {
  status: TaskStatus;
  submitting: boolean;
  onChange: (status: TaskStatus) => void;
};

export function StatusSelect({
  status,
  submitting,
  onChange,
}: StatusSelectProps) {
  return (
    <Field label="Status">
      <Select
        value={status}
        onChange={(event) => onChange(event.target.value as TaskStatus)}
        options={taskStatusOrder.map((value) => ({
          value,
          label: taskStatusLabels[value],
        }))}
        disabled={submitting}
      />
    </Field>
  );
}
