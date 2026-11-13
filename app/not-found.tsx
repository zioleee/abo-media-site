// app/not-found.tsx — an address that leads nowhere (and a news item that does not exist)
import NoteView from "./_mono/views/NoteView";
import { NOT_FOUND } from "./_mono/content";

export default function NotFound() {
  return <NoteView lang="ko" path="/" page="nf" name="404" columns={[["페이지를"], ["찾을 수 없습니다"]]} text={NOT_FOUND.en.title} home={NOT_FOUND.ko.home} />;
}
