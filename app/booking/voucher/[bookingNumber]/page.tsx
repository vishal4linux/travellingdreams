import { VoucherPrintButton } from "@/components/booking/VoucherPrintButton";
import { formatINR } from "@/lib/utils";
import { getBookingByNumber } from "@/services/packages";
import { decimalToNumber } from "@/lib/serialize";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ bookingNumber: string }> };

export default async function BookingVoucherPage({ params }: Props) {
  const { bookingNumber } = await params;
  const booking = await getBookingByNumber(bookingNumber);
  if (!booking) notFound();
  if (!["PAID", "CONFIRMED", "COMPLETED"].includes(booking.status)) {
    notFound();
  }

  const isHotel = booking.type === "HOTEL";

  return (
    <div className="section-padding bg-white print:p-8">
      <div className="container-site max-w-2xl print:max-w-none">
        <div className="flex items-start justify-between border-b border-border pb-6">
          <div>
            <p className="font-display text-2xl font-semibold text-brand-900">Travelling Dreams</p>
            <p className="text-sm text-ink-muted">Travel voucher</p>
          </div>
          <p className="font-mono text-sm">{booking.bookingNumber}</p>
        </div>

        <section className="mt-8 space-y-4 text-sm">
          <p>
            <span className="text-ink-muted">Guest: </span>
            {booking.hotelBooking?.guestName ?? booking.packageBooking?.guestName}
          </p>
          <p>
            <span className="text-ink-muted">Email: </span>
            {booking.hotelBooking?.guestEmail ?? booking.packageBooking?.guestEmail}
          </p>
          <p>
            <span className="text-ink-muted">Phone: </span>
            {booking.hotelBooking?.guestPhone ?? booking.packageBooking?.guestPhone}
          </p>
          <p>
            <span className="text-ink-muted">Amount: </span>
            {formatINR(decimalToNumber(booking.totalAmount) ?? 0)}
          </p>

          {isHotel && booking.hotelBooking ? (
            <>
              <p>
                <span className="text-ink-muted">Hotel: </span>
                {booking.hotelBooking.hotel.name}
              </p>
              <p>
                <span className="text-ink-muted">Room: </span>
                {booking.hotelBooking.roomType.name}
              </p>
              <p>
                <span className="text-ink-muted">Stay: </span>
                {booking.hotelBooking.checkIn.toISOString().slice(0, 10)} →{" "}
                {booking.hotelBooking.checkOut.toISOString().slice(0, 10)}
              </p>
            </>
          ) : null}

          {!isHotel && booking.packageBooking ? (
            <>
              <p>
                <span className="text-ink-muted">Package: </span>
                {booking.packageBooking.package.title}
              </p>
              <p>
                <span className="text-ink-muted">Travel date: </span>
                {booking.packageBooking.travelDate.toISOString().slice(0, 10)}
              </p>
              <p>
                <span className="text-ink-muted">Travelers: </span>
                {booking.packageBooking.adults} adult(s)
                {booking.packageBooking.children
                  ? `, ${booking.packageBooking.children} child(ren)`
                  : ""}
              </p>
            </>
          ) : null}
        </section>

        <p className="mt-10 text-xs text-ink-subtle">
          Present this voucher (printed or digital) along with a valid photo ID at check-in. For support,
          contact Travelling Dreams with your booking reference.
        </p>

        <VoucherPrintButton />
      </div>
    </div>
  );
}
