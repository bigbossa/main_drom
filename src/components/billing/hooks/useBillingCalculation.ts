import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRoomOccupancyData } from "./useRoomOccupancyData";
import { useBillingFormState } from "./useBillingFormState";
import { useBillingCalculationLogic } from "./useBillingCalculationLogic";
import { createRoomBillingRecord } from "../utils/billingApi";
import { supabase } from "@/integrations/supabase/client";

export const useBillingCalculation = (open: boolean, onBillingCreated: () => void, onOpenChange: (open: boolean) => void) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const { roomOccupancies } = useRoomOccupancyData(open);
  
  const {
    selectedRoom,
    setSelectedRoom,
    billingMonth,
    setBillingMonth,
    waterUnits,
    setWaterUnits,
    electricityUnits,
    setElectricityUnits,
    previousMeterReading,
    setPreviousMeterReading,
    currentMeterReading,
    setCurrentMeterReading,
    dueDate,
    setDueDate,
    resetForm
  } = useBillingFormState(open);

  const {
    selectedRoomData,
    roomRent,
    waterCost,
    electricityCost,
    totalAmount,
    occupantCount,
    WATER_RATE,
    ELECTRICITY_RATE
  } = useBillingCalculationLogic(roomOccupancies, selectedRoom, waterUnits, electricityUnits);

  // Load latest meter reading when room is selected
  useEffect(() => {
    if (selectedRoomData) {
      setPreviousMeterReading(selectedRoomData.latest_meter_reading || 0);
    }
  }, [selectedRoomData, setPreviousMeterReading]);

  const handleCreateBilling = async () => {
    try {
      setLoading(true);
          const billingData = {
        selectedRoomData,
        billingMonth,
        roomRent,
        waterUnits,
        waterCost,
        electricityUnits,
        electricityCost,
        totalAmount,
        dueDate,
        occupantCount
      };

      await createRoomBillingRecord(billingData);

      // Update latest meter reading for all occupants in the room
      const updatePromises = selectedRoomData.occupants.map(occupant => 
        supabase
          .from('occupancy')
          .update({ latest_meter_reading: currentMeterReading })
          .eq('id', occupant.occupancy_id)
      );

      const results = await Promise.allSettled(updatePromises);
      const failedUpdates = results.filter(result => result.status === 'rejected');
      
      if (failedUpdates.length > 0) {
        console.error('Some meter reading updates failed:', failedUpdates);
        toast({
          title: "Warning",
          description: "Billing created but some meter readings failed to update",
          variant: "destructive",
        });
      }

      toast({
        title: "Billing Created",
        description: `Billing record created successfully for room ${selectedRoomData.room_number} - ${totalAmount.toLocaleString()} THB`,
      });

      onBillingCreated();
      onOpenChange(false);
      resetForm();
    } catch (err) {
      console.error('Error in handleCreateBilling:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    roomOccupancies,
    selectedRoom,
    setSelectedRoom,
    billingMonth,
    setBillingMonth,
    waterUnits,
    setWaterUnits,
    electricityUnits,
    setElectricityUnits,
    previousMeterReading,
    setPreviousMeterReading,
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
  };
};
