import Container from "@/components/layout/Container";

const faqs = [
  {
    question: "Is CivicConnect free to use?",
    answer:
      "Yes. CivicConnect is completely free for citizens to report civic issues.",
  },
  {
    question: "Can I upload photos with my complaint?",
    answer:
      "Yes. You can attach multiple images to provide evidence for your complaint.",
  },
  {
    question: "How does AI help?",
    answer:
      "AI generates a professional complaint draft based on the information you provide.",
  },
  {
    question: "Will my complaint reach the correct authority?",
    answer:
      "CivicConnect identifies the appropriate department based on the issue category and location.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-slate-50 py-24">
      <Container>
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            Frequently Asked Questions
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Find answers to the most common questions about CivicConnect.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="rounded-xl border bg-white p-5"
            >
              <summary className="cursor-pointer font-semibold">
                {faq.question}
              </summary>

              <p className="mt-4 text-slate-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}