
import { useState, useEffect } from "react";

export const useBillingFormState = (open: boolean) => {
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [billingMonth, setBillingMonth] = useState("");
  const [waterUnits, setWaterUnits] = useState<number>(1);
  const [electricityUnits, setElectricityUnits] = useState<number>(0);
  const [previousMeterReading, setPreviousMeterReading] = useState<number>(0);
  const [currentMeterReading, setCurrentMeterReading] = useState<number>(0);
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (open) {
      // Set default due date to end of current month
      const today = new Date();
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setDueDate(lastDay.toISOString().split('T')[0]);
      
      // Set default billing month to current month
      const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      setBillingMonth(currentMonth.toISOString().split('T')[0]);
    }
  }, [open]);

  // Calculate electricity units from meter readings
  useEffect(() => {
    const calculatedUnits = Math.max(0, currentMeterReading - previousMeterReading);
    setElectricityUnits(calculatedUnits);
  }, [currentMeterReading, previousMeterReading]);

  const resetForm = () => {
    setSelectedRoom("");
    setWaterUnits(1);
    setElectricityUnits(0);
    setPreviousMeterReading(0);
    setCurrentMeterReading(0);
    setBillingMonth("");
    setDueDate("");
  };

  return {
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
  };
};
