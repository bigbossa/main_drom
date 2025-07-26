
import { Input } from "@/components/ui/input";
import { Zap, Droplet, Home, Users } from "lucide-react";

interface CostBreakdownProps {
  roomRent: number;
  waterUnits: number;
  onWaterUnitsChange: (value: number) => void;
  waterCost: number;
  electricityUnits: number;
  previousMeterReading: number;
  currentMeterReading: number;
  onCurrentMeterReadingChange: (value: number) => void;
  electricityCost: number;
  totalAmount: number;
  occupantCount: number;
  WATER_RATE: number;
  ELECTRICITY_RATE: number;
}

export default function CostBreakdown({
  roomRent,
  waterUnits,
  onWaterUnitsChange,
  waterCost,
  electricityUnits,
  previousMeterReading,
  currentMeterReading,
  onCurrentMeterReadingChange,
  electricityCost,
  totalAmount,
  occupantCount,
  WATER_RATE,
  ELECTRICITY_RATE
}: CostBreakdownProps) {
  return (
    <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
      <h4 className="font-semibold text-lg">รายละเอียดค่าใช้จ่าย</h4>
      
      {/* Occupant Count */}
      <div className="flex items-center justify-between p-3 bg-white rounded border">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-green-600" />
          <span>จำนวนผู้เช่าในห้อง</span>
        </div>
        <span className="font-medium">{occupantCount} คน</span>
      </div>

      {/* Room Rent */}
      <div className="flex items-center justify-between p-3 bg-white rounded border">
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-blue-600" />
          <span>ค่าห้อง</span>
        </div>
        <span className="font-medium">{roomRent.toLocaleString()} บาท</span>
      </div>

      {/* Water Cost */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-white rounded border">
          <div className="flex items-center gap-2">
            <Droplet className="h-4 w-4 text-blue-600" />
            <span>ค่าน้ำ ({occupantCount} คน × {WATER_RATE} บาท/หัว)</span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={waterUnits}
              onChange={(e) => onWaterUnitsChange(Number(e.target.value))}
              min="1"
              className="w-20"
            />
            <span>หัว</span>
            <span className="font-medium ml-2">{waterCost.toLocaleString()} บาท</span>
          </div>
        </div>
      </div>

      {/* Electricity Cost */}
      <div className="space-y-2">
        <div className="p-3 bg-white rounded border">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-yellow-600" />
            <span>ค่าไฟ (หน่วยละ {ELECTRICITY_RATE} บาท)</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">เลขมิเตอร์เก่า:</span>
              <span className="font-medium">{previousMeterReading.toFixed(1)}</span>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">เลขมิเตอร์ใหม่</label>
              <Input
                type="number"
                value={currentMeterReading}
                onChange={(e) => onCurrentMeterReadingChange(Number(e.target.value))}
                min="0"
                step="0.1"
                placeholder="กรอกเลขมิเตอร์ใหม่"
              />
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-gray-50 rounded border flex justify-between items-center">
            <span className="text-sm text-gray-600">หน่วยที่ใช้:</span>
            <span className="font-medium">{electricityUnits.toFixed(1)} หน่วย = {electricityCost.toLocaleString()} บาท</span>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between p-3 bg-green-50 rounded border-2 border-green-200">
        <span className="font-semibold text-lg">รวมทั้งหมด</span>
        <span className="font-bold text-xl text-green-600">{totalAmount.toLocaleString()} บาท</span>
      </div>
      
      <div className="text-sm text-gray-600 p-2 bg-blue-50 rounded">
        <span>หมายเหตุ: บิลนี้สำหรับทั้งห้อง รวม {occupantCount} คน</span>
      </div>
    </div>
  );
}
