import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, AlertCircle, Home, Building } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { Input } from "@/components/ui/input";

type Tenant = Database['public']['Tables']['tenants']['Row'] & {
  current_room?: {
    id: string;
    room_number: string;
    room_type: string;
    floor: number;
  } | null;
};

interface TenantDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant | null;
  oldValue?: Tenant;
}

export default function TenantDetailsDialog({
  open,
  onOpenChange,
  tenant,
  oldValue,
}: TenantDetailsDialogProps) {
  if (!tenant) return null;

  const fullName = `${tenant.first_name} ${tenant.last_name}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ข้อมูลผู้เช่า</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`} 
                alt={fullName} 
              />
              <AvatarFallback>
                {tenant.first_name.charAt(0)}{tenant.last_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{fullName}</h3>
              <Badge variant="secondary">ผู้เช่า</Badge>
            </div>
          </div>
          
          <div className="space-y-4">
            {tenant.current_room && (
              <div className="flex items-center space-x-3">
                <Home className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">ห้องที่เช่า</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">ห้อง {tenant.current_room.room_number}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {tenant.current_room.room_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Building className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      ชั้น {tenant.current_room.floor}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {tenant.email && (
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">อีเมล</p>
                  <p className="text-sm text-muted-foreground">{tenant.email}</p>
                </div>
              </div>
            )}
            
            {tenant.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">เบอร์โทร</p>
                  <p className="text-sm text-muted-foreground">{tenant.phone}</p>
                </div>
              </div>
            )}
            
            {tenant.address && (
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">ที่อยู่</p>
                  <p className="text-sm text-muted-foreground">{tenant.address}</p>
                </div>
              </div>
            )}
            
            {tenant.emergency_contact && (
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">ติดต่อฉุกเฉิน</p>
                  <p className="text-sm text-muted-foreground">{tenant.emergency_contact}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>สร้างเมื่อ: {new Date(tenant.created_at!).toLocaleDateString('th-TH')}</p>
            {tenant.updated_at && (
              <p>อัปเดตล่าสุด: {new Date(tenant.updated_at).toLocaleDateString('th-TH')}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
