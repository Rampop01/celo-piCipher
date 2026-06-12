"use client";
import { ChevronRight } from "lucide-react";

const faqData = [
  { q: "What is PiCipher?", a: "" },
  { q: "How do I play?", a: "" }
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono">
      <div className="max-w-4xl mx-auto border-l-2 border-r-2 border-[#35D07F]/30 min-h-[80vh] p-8">
        <div className="flex flex-col gap-4">
          {faqData.map((item, i) => (
            <div key={i} className="border border-white/10 p-4">{item.q}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
