// app/en/ir/page.tsx
import type { Metadata } from "next";
import NoteView from "../../_mono/views/NoteView";
import { HERO, IR } from "../../_mono/content";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function EnIrPage() {
  return <NoteView lang="en" path="/ir" page="ir" name="IR" columns={HERO.ir.en} text={IR.en.text} />;
}
