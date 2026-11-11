// app/en/not-found.tsx — a news item that does not exist (under /en)
import NoteView from "../_mono/views/NoteView";
import { NOT_FOUND } from "../_mono/content";

export default function NotFound() {
  return <NoteView lang="en" path="/" page="nf" name="404" columns={[[NOT_FOUND.en.title]]} text={NOT_FOUND.ko.title} home={NOT_FOUND.en.home} />;
}
