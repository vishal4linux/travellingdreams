import { LegalPage } from "@/lib/legal-content";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      body="{SITE} collects contact and booking details to fulfill reservations. Data is stored securely and not sold to third parties. Payment data is processed by certified payment partners."
    />
  );
}
