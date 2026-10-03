import type { CreateOrderInput, CreateOrderResult, PaymentProvider } from "./types";

export const mockPaymentProvider: PaymentProvider = {
  name: "mock",
  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    return {
      provider: "mock",
      orderId: `mock_order_${input.bookingNumber}`,
      amount: input.amountPaise,
      currency: input.currency ?? "INR",
    };
  },
};
