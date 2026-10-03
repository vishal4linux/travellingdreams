import { CancelBookingButton } from "@/components/account/CancelBookingButton";
import { ButtonLink } from "@/components/ui/button";
import { getCustomerSession } from "@/lib/auth/session";
import { formatINR } from "@/lib/utils";
import { decimalToNumber } from "@/lib/serialize";
import { getCustomerBookings } from "@/services/customer";
import { redirect } from "next/navigation";

export default async function AccountBookingsPage() {
  const session = await getCustomerSession();
  if (!session) redirect("/account/login");

  const bookings = await getCustomerBookings(session.customerId);

  return (
    <div className="section-padding bg-surface">
      <div className="container-site max-w-3xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold">My bookings</h1>
            <p className="mt-2 text-sm text-ink-muted">Signed in as {session.email}</p>
          </div>
          <ButtonLink href="/account/profile" variant="secondary" size="sm">
            Profile
          </ButtonLink>
        </div>
        <ul className="mt-8 space-y-4">
          {bookings.map((b) => {
            const canPay = b.status === "PAYMENT_PENDING" || b.status === "PENDING";
            const canVoucher = b.status === "PAID" || b.status === "CONFIRMED";
            return (
              <li key={b.id} className="rounded-2xl border border-border p-5">
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="font-mono font-medium">{b.bookingNumber}</p>
                  <span className="text-sm text-ink-muted">{b.status}</span>
                </div>
                <p className="mt-2 text-sm">
                  {b.hotelBooking?.hotel.name ?? b.packageBooking?.package.title ?? b.type}
                </p>
                <p className="mt-1 font-display text-xl text-brand-800">
                  {formatINR(decimalToNumber(b.totalAmount) ?? 0)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ButtonLink href={`/booking/confirmation/${b.bookingNumber}`} variant="secondary" size="sm">
                    Details
                  </ButtonLink>
                  {canPay ? (
                    <ButtonLink href={`/booking/pay/${b.bookingNumber}`} size="sm">
                      Pay now
                    </ButtonLink>
                  ) : null}
                  {canVoucher ? (
                    <ButtonLink href={`/booking/voucher/${b.bookingNumber}`} variant="secondary" size="sm">
                      Voucher
                    </ButtonLink>
                  ) : null}
                </div>
                {!["CANCELLED", "REFUNDED"].includes(b.status) ? (
                  <CancelBookingButton bookingNumber={b.bookingNumber} email={session.email} />
                ) : null}
              </li>
            );
          })}
        </ul>
        {bookings.length === 0 ? (
          <p className="mt-8 text-ink-muted">
            No bookings yet.{" "}
            <ButtonLink href="/account/lookup" variant="ghost" className="inline px-0">
              Look up a guest booking
            </ButtonLink>
          </p>
        ) : null}
      </div>
    </div>
  );
}
