
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoomOccupancy {
  room_id: string;
  room_number: string;
  room_price: number;
  occupant_count: number;
  latest_meter_reading: number;
  occupants: Array<{
    tenant_id: string;
    tenant_name: string;
    occupancy_id: string;
  }>;
}

interface RoomSelectorProps {
  roomOccupancies: RoomOccupancy[];
  selectedRoom: string;
  onRoomChange: (value: string) => void;
}

export default function RoomSelector({ 
  roomOccupancies, 
  selectedRoom, 
  onRoomChange 
}: RoomSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="room">เลือกห้อง</Label>
     <Select
  value={selectedRoom}
  onValueChange={(value) => {
    console.log("เลือกห้อง:", value);
    onRoomChange(value);
  }}
>

        <SelectTrigger>
          <SelectValue placeholder="เลือกห้อง" />
        </SelectTrigger>
        <SelectContent>
          {roomOccupancies.map((room) => (
            <SelectItem key={room.room_id} value={room.room_id}>
              ห้อง {room.room_number} - {room.occupant_count} คน ({room.occupants.map(o => o.tenant_name).join(', ')})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
