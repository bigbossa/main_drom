
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BillingDateInputsProps {
  billingMonth: string;
  onBillingMonthChange: (value: string) => void;
  dueDate: string;
  onDueDateChange: (value: string) => void;
}

export default function BillingDateInputs({
  billingMonth,
  onBillingMonthChange,
  dueDate,
  onDueDateChange
}: BillingDateInputsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="billingMonth">เดือนที่คิดค่าใช้จ่าย</Label>
        <Input
          id="billingMonth"
          type="month"
          value={billingMonth}
          onChange={(e) => onBillingMonthChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">วันครบกำหนดชำระ</Label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => onDueDateChange(e.target.value)}
        />
      </div>
    </>
  );
}
