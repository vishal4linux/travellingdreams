import { PayBookingClient } from "@/components/payments/PayBookingClient";
import { getBookingPaymentBalance } from "@/services/payments";
import { notFound, redirect } from "next/navigation";

type Props = { params: Promise<{ bookingNumber: string }> };

export default async function PayBookingPage({ params }: Props) {
  const { bookingNumber } = await params;
  const balance = await getBookingPaymentBalance(bookingNumber);
  if (!balance) notFound();
  if (balance.remaining <= 0 && balance.booking.status === "PAID") {
    redirect(`/booking/confirmation/${bookingNumber}`);
  }

  const guestName =
    balance.booking.hotelBooking?.guestName ?? balance.booking.packageBooking?.guestName ?? "";
  const guestEmail =
    balance.booking.hotelBooking?.guestEmail ?? balance.booking.packageBooking?.guestEmail ?? "";
  const guestPhone =
    balance.booking.hotelBooking?.guestPhone ?? balance.booking.packageBooking?.guestPhone ?? "";

  return (
    <div className="section-padding bg-surface">
      <div className="container-site max-w-lg">
        <h1 className="font-display text-3xl font-semibold">Secure payment</h1>
        <div className="mt-8">
          <PayBookingClient
            bookingNumber={bookingNumber}
            total={balance.total}
            paid={balance.paid}
            remaining={balance.remaining}
            guestName={guestName}
            guestEmail={guestEmail}
            guestPhone={guestPhone}
            showMock={
              process.env.NODE_ENV !== "production" &&
              (process.env.ALLOW_MOCK_PAYMENT === "1" || !process.env.RAZORPAY_KEY_SECRET)
            }
          />
        </div>
      </div>
    </div>
  );
}
