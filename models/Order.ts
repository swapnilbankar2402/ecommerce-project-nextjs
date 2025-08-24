import { Schema, model, models, Document } from 'mongoose';

interface IOrderItem {
  productId: Schema.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

interface IOrder extends Document {
  user: Schema.Types.ObjectId;
  items: IOrderItem[];
  status: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new Schema<IOrder>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  items: [
    OrderItemSchema
  ],
  status: {
    type: String,
    required: true,
    default: 'pending',
  },
  total: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Order = models.Order || model<IOrder>('Order', OrderSchema);

export default Order;

