import { BookingInterface } from "./BookingInterface";

export interface ElectricityLogInterface {
  id: string;
  bookingId: string;
  booking: BookingInterface;
  electricityInt: number;
  createdAt: Date;
  updatedAt: Date;
}
