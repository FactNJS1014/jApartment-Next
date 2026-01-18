import RoomTypeInterface from "./RoomTypeInterface";
import { BookingInterface } from "./BookingInterface";

export interface RoomInterface {
  id: string;
  name: string;
  tolowerName: string;
  totalLevel: number;
  totalRoom: number;
  roomTypeId: string;
  roomType: RoomTypeInterface;
  remark: string;
  status: string;
  statusEmpty: string;
  createdAt: string;
  updatedAt: string;
  bookings: BookingInterface[];
}
