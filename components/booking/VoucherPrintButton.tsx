"use client";

import { Button } from "@/components/ui/button";

export function VoucherPrintButton() {
  return (
    <Button type="button" className="mt-8 print:hidden" onClick={() => window.print()}>
      Print voucher
    </Button>
  );
}
