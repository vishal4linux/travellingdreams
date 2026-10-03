import { ButtonLink } from "@/components/ui/button";
import { getCustomerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/account/ProfileForm";

export default async function AccountProfilePage() {
  const session = await getCustomerSession();
  if (!session) redirect("/account/login");

  const customer = await prisma.customer.findUnique({
    where: { id: session.customerId },
  });
  if (!customer) redirect("/account/login");

  return (
    <div className="section-padding bg-surface">
      <div className="container-site max-w-md">
        <h1 className="font-display text-3xl font-semibold">Profile</h1>
        <p className="mt-2 text-sm text-ink-muted">{session.email}</p>
        <ProfileForm
          initial={{
            name: customer.name ?? "",
            phone: customer.phone ?? "",
          }}
        />
        <p className="mt-8 text-sm text-ink-muted">
          <ButtonLink href="/account/bookings" variant="ghost" className="inline px-0">
            My bookings
          </ButtonLink>
        </p>
      </div>
    </div>
  );
}
