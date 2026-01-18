import { BookingInterface } from "./BookingInterface";

export interface WaterLogInterface {
  id: string;
  bookingId: string;
  booking: BookingInterface;
  waterInt: number;
  createdAt: Date;
  updatedAt: Date;
}
