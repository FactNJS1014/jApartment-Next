import { BookingInterface } from "./BookingInterface";
import { RoomInterface } from "./RoomInterface";

export interface RoomTransferInterface {
  id: string;
  fromRoom: RoomInterface;
  toRoom: RoomInterface;
  fromRoomId: string;
  toRoomId: string;
  bookingId: string;
  booking: BookingInterface;
  transferDate: Date;
  reason?: string;
  transferFee?: string;
  status: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
