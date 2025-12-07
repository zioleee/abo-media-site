export default function Contact() {
  return (
    <section className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold">문의</h1>
      <form className="mt-4 flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="이름"
          className="border rounded p-2"
        />
        <input
          type="email"
          placeholder="이메일"
          className="border rounded p-2"
        />
        <textarea
          placeholder="문의 내용"
          rows={4}
          className="border rounded p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2"
        >
          보내기
        </button>
      </form>
    </section>
  );
}
