import { ElectricityLogInterface } from "./ElectricityLogInterface";
import { WaterLogInterface } from "./WaterLogInterface";

export interface BookingInterface {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  cardId: string;
  gender: string;
  roomId: string;
  remark: string;
  status: string;
  stayAt: Date;
  stayTo: Date;
  deposit: number;
  electricitylog: ElectricityLogInterface[];
  waterlog: WaterLogInterface[];
}
