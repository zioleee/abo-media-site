// app/ir/page.tsx
import type { Metadata } from "next";
import NoteView from "../_mono/views/NoteView";
import { HERO, IR } from "../_mono/content";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function IrPage() {
  return <NoteView lang="ko" path="/ir" page="ir" name="IR" columns={HERO.ir.ko} text={IR.ko.text} />;
}
