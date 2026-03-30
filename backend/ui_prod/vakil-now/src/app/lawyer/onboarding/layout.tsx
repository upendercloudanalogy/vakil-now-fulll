'use client';

import { Footer } from "@/components/common/footer";
import React, { useEffect } from "react";

export default function LawyerRegisterLayout ({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
      <div className="min-h-screen w-full flex flex-col">

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex flex-1">
          {children}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full mt-30">
        <Footer />
      </footer>

    </div>
  );


}
