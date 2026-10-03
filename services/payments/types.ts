export type CreateOrderInput = {
  bookingNumber: string;
  amountPaise: number;
  currency?: string;
  customerEmail: string;
  customerPhone: string;
};

export type CreateOrderResult = {
  provider: string;
  orderId: string;
  amount: number;
  currency: string;
  keyId?: string;
};

export interface PaymentProvider {
  name: string;
  createOrder(input: CreateOrderInput): Promise<CreateOrderResult>;
  verifyPaymentSignature?(payload: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): boolean;
}
