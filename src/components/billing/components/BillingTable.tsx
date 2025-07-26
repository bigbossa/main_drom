import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BillingStatusBadge from "@/components/billing/BillingStatusBadge";
import { useAuth } from "@/providers/AuthProvider";

interface BillingRecord {
  id: string;
  billing_month: string;
  tenant_id: string;
  room_rent: number;
  water_units: number;
  water_cost: number;
  electricity_units: number;
  electricity_cost: number;
  sum: number;
  status: string;
  due_date: string;
  paid_date: string | null;
  created_at: string;
  receipt_number: string;
  fullname: string | null;
  rooms: {
    room_number: string;
  };
  tenants: {
    first_name: string;
    last_name: string;
  };
}

interface BillingTableProps {
  billings: BillingRecord[];
  filteredBillings: BillingRecord[];
  onMarkAsPaid: (billingId: string) => void;
  onViewDetails: (billing: BillingRecord) => void;
  onPayClick: (billing: BillingRecord) => void;
}

export default function BillingTable({ 
  billings, 
  filteredBillings, 
  onMarkAsPaid,
  onViewDetails,
  onPayClick 
}: BillingTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH');
  };

  const formatMonth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  console.log('user', user);
 const visibleBillings = filteredBillings.filter((billing) => {
  if (user?.role === 'admin' || user?.role === 'staff') return true;
  if (user?.role === 'tenant') return billing.tenant_id === user.tenant?.id;
  return false;
});

  return (
    <Card>
      <CardHeader>
        <CardTitle>รายการบิล</CardTitle>
        <CardDescription>
          แสดง {visibleBillings.length} จาก {visibleBillings.length} รายการ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>              <TableRow>
                <TableHead>เดือน</TableHead>
                <TableHead>เลขที่ใบเสร็จ</TableHead>
                <TableHead>ผู้เช่า</TableHead>
                <TableHead>ห้อง</TableHead>
                <TableHead>ค่าห้อง</TableHead>
                <TableHead>ค่าน้ำ</TableHead>
                <TableHead>ค่าไฟ</TableHead>
                <TableHead>รวม</TableHead>
                <TableHead>ครบกำหนด</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่ชำระ</TableHead>
                <TableHead className="text-right">การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
         <TableBody>
             {filteredBillings
                .filter((billing) => {
                  if (user?.role === 'admin' || user?.role === 'staff') return true;
                  if (user?.role === 'tenant') {
                    console.log('compare:', billing.tenant_id, user.profile?.tenant_id);
                    return billing.tenant_id === user.profile?.tenant_id;
                  }
                  return false;
                })
                .map((billing) => (
                  <TableRow key={billing.id}>                   
                   <TableCell className="font-medium">
                      {formatMonth(billing.billing_month)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {billing.receipt_number || '-'}
                    </TableCell>
                    <TableCell>
                      {billing.fullname}
                    </TableCell>
                    <TableCell>{billing.rooms.room_number}</TableCell>
                    <TableCell>{formatCurrency(billing.room_rent)}</TableCell>
                    <TableCell>
                      {formatCurrency(billing.water_cost)}
                      <div className="text-xs text-muted-foreground">
                        {billing.water_units} คน
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(billing.electricity_cost)}
                      <div className="text-xs text-muted-foreground">
                        {billing.electricity_units} หน่วย
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">
                      {formatCurrency(billing.sum)}
                    </TableCell>
                    <TableCell>{formatDate(billing.due_date)}</TableCell>
                    <TableCell>
                      <BillingStatusBadge status={billing.status} />
                    </TableCell>
                    <TableCell>
                      {billing.paid_date
                        ? formatDate(billing.paid_date)
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetails(billing)}
                        >
                          ดูรายละเอียด
                        </Button>
                        {isAdmin && billing.status !== 'paid' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onMarkAsPaid(billing.id)}
                          >
                            ชำระแล้ว
                          </Button>
                        )}
                        {!isAdmin && billing.status !== 'paid' && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => onPayClick(billing)}
                          >
                            ชำระเงิน
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

              {filteredBillings
              .filter((billing) => {
              if (user?.role === 'admin' || user?.role === 'staff') return true;
              if (user?.role === 'tenant') return billing.tenant_id === user.profile?.tenant_id;
              return false;
              }).length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-4">
                    ไม่พบข้อมูลบิลที่ตรงกับเงื่อนไขการค้นหา
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
