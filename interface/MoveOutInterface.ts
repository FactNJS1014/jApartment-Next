import { BookingInterface } from "./BookingInterface";
import { RoomInterface } from "./RoomInterface";

export interface MoveOutInterface {
  id: string;
  roomId: string;
  room: RoomInterface;
  bookingId: string;
  booking: BookingInterface;
  moveOutDate: Date;
  depositReturn?: Date;
  outstandingFees?: string;
  reason?: string;
  status: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
