import { ButtonLink } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { getBookingByNumber } from "@/services/packages";
import { getBookingPaymentBalance } from "@/services/payments";
import { decimalToNumber } from "@/lib/serialize";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ bookingNumber: string }> };

export default async function BookingConfirmationPage({ params }: Props) {
  const { bookingNumber } = await params;
  const booking = await getBookingByNumber(bookingNumber);
  if (!booking) notFound();

  const balance = await getBookingPaymentBalance(bookingNumber);
  const isHotel = booking.type === "HOTEL";
  const isFullyPaid =
    booking.status === "PAID" ||
    booking.status === "CONFIRMED" ||
    (balance && balance.remaining <= 0);

  return (
    <div className="section-padding bg-surface">
      <div className="container-site max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
          {isFullyPaid ? "Confirmed" : "Booking received"}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          {isFullyPaid ? "Booking confirmed" : "Payment pending"}
        </h1>
        <p className="mt-2 text-ink-muted">
          Reference: <span className="font-mono font-medium text-ink">{booking.bookingNumber}</span>
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-surface-elevated p-6">
          <p className="text-sm text-ink-muted">Booking total</p>
          <p className="font-display text-3xl font-semibold text-brand-800">
            {formatINR(decimalToNumber(booking.totalAmount) ?? 0)}
          </p>
          {balance && balance.paid > 0 ? (
            <p className="mt-2 text-sm text-ink-muted">
              Paid {formatINR(balance.paid)}
              {balance.remaining > 0 ? ` · Balance ${formatINR(balance.remaining)}` : ""}
            </p>
          ) : null}
          <p className="mt-1 text-sm text-ink-muted">Status: {booking.status}</p>
          {isHotel && booking.hotelBooking ? (
            <ul className="mt-4 space-y-1 text-sm text-ink-muted">
              <li>{booking.hotelBooking.hotel.name}</li>
              <li>
                {booking.hotelBooking.checkIn.toISOString().slice(0, 10)} →{" "}
                {booking.hotelBooking.checkOut.toISOString().slice(0, 10)}
              </li>
              <li>{booking.hotelBooking.roomType.name}</li>
            </ul>
          ) : null}
          {!isHotel && booking.packageBooking ? (
            <ul className="mt-4 space-y-1 text-sm text-ink-muted">
              <li>{booking.packageBooking.package.title}</li>
              <li>Travel date: {booking.packageBooking.travelDate.toISOString().slice(0, 10)}</li>
            </ul>
          ) : null}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {balance && balance.remaining > 0 ? (
            <ButtonLink href={`/booking/pay/${bookingNumber}`}>Pay balance</ButtonLink>
          ) : null}
          {isFullyPaid ? (
            <ButtonLink href={`/booking/voucher/${bookingNumber}`} variant="secondary">
              Download voucher
            </ButtonLink>
          ) : null}
          <ButtonLink href="/account/lookup" variant="secondary">
            Find booking later
          </ButtonLink>
          <ButtonLink href="/account/bookings">My bookings</ButtonLink>
          <ButtonLink href="/" variant="ghost">
            Back home
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
