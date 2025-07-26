import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { useBillingCalculation } from "./hooks/useBillingCalculation";
import RoomSelector from "./components/RoomSelector";
import BillingDateInputs from "./components/BillingDateInputs";
import CostBreakdown from "./components/CostBreakdown";

interface BillingCalculationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBillingCreated: () => void;
}

export default function BillingCalculationDialog({ 
  open, 
  onOpenChange, 
  onBillingCreated 
}: BillingCalculationDialogProps) {
  const {
    loading,
    roomOccupancies,
    selectedRoom,
    setSelectedRoom,
    billingMonth,
    setBillingMonth,
    waterUnits,
    setWaterUnits,
    electricityUnits,
    previousMeterReading,
    currentMeterReading,
    setCurrentMeterReading,
    dueDate,
    setDueDate,
    selectedRoomData,
    roomRent,
    waterCost,
    electricityCost,
    totalAmount,
    occupantCount,
    handleCreateBilling,
    WATER_RATE,
    ELECTRICITY_RATE
  } = useBillingCalculation(open, onBillingCreated, onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogHeader className="sticky top-0 bg-background z-999 pb-4 border-b">
          <DialogTitle>
            คำนวณค่าใช้จ่าย (ตามห้อง)
          </DialogTitle>
          <DialogDescription>
            คำนวณค่าห้อง + ค่าน้ำ (ตามจำนวนคน × {WATER_RATE} บาท/หัว) + ค่าไฟ (หน่วยละ {ELECTRICITY_RATE} บาท) สำหรับห้อง
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <RoomSelector
            roomOccupancies={roomOccupancies}
            selectedRoom={selectedRoom}
            onRoomChange={setSelectedRoom}
          />

          <BillingDateInputs
            billingMonth={billingMonth}
            onBillingMonthChange={setBillingMonth}
            dueDate={dueDate}
            onDueDateChange={setDueDate}
          />

          {selectedRoomData && (
            <CostBreakdown
              roomRent={roomRent}
              waterUnits={waterUnits}
              onWaterUnitsChange={setWaterUnits}
              waterCost={waterCost}
              electricityUnits={electricityUnits}
              previousMeterReading={previousMeterReading}
              currentMeterReading={currentMeterReading}
              onCurrentMeterReadingChange={setCurrentMeterReading}
              electricityCost={electricityCost}
              totalAmount={totalAmount}
              occupantCount={occupantCount}
              WATER_RATE={WATER_RATE}
              ELECTRICITY_RATE={ELECTRICITY_RATE}
            />
          )}
        </div>

        <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button onClick={handleCreateBilling} disabled={loading || !selectedRoom}>
            {loading ? "กำลังสร้าง..." : "สร้างบิล"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
