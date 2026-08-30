import Container from "@/components/layout/Container";

const faqs = [
  {
    question: "What do I need before I register?",
    answer:
      "Your full name, a working email ID, a 10-digit mobile number, and your residential address with PIN code. After you submit the form, a 6-digit token is emailed to you. The account is activated only after that token is verified.",
  },
  {
    question: "Why do I have to verify my email?",
    answer:
      "The token proves that the email belongs to you. Until it is confirmed, you cannot log in, see civic desks, or file a complaint. The token expires in 15 minutes and can be resent from the verification page.",
  },
  {
    question: "How do you find the nearest civic body?",
    answer:
      "We match your city, state and PIN code against municipal corporations, electricity DISCOMs, water boards and traffic desks. Exact PIN matches rank highest, then the same postal circle, then the same city.",
  },
  {
    question: "Where does my complaint go?",
    answer:
      "It is emailed to the registered complaint desk of the matched civic body. You receive a tracking ID immediately and can open the same letter in your own email client if you want a personal copy.",
  },
  {
    question: "Can I track a complaint without logging in?",
    answer:
      "Yes. Open Track and enter the CivicConnect ID printed on your acknowledgement, for example CCI-NEW-20260823-ROAD.",
  },
  {
    question: "Can I sign in with Google?",
    answer:
      "Yes. Click 'Continue with Google' on the login or register page. Your Google email is verified automatically, so you can start filing complaints right away.",
  },
  {
    question: "Where can I learn about civic rights and city budgets?",
    answer:
      "Open the Civic guide. It has long-form articles on municipal finance, the 74th Amendment, RTI for civic works, and how to escalate a stalled complaint to the next authority.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-[#efe7d8] py-24">
      <Container>
        <div className="text-center">
          <h2 className="font-display text-4xl text-[var(--navy)]">
            Frequently asked questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            What you need, how routing works, and how tracking stays with you.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="rounded-2xl border border-[#e5dccb] bg-white p-5 shadow-sm"
            >
              <summary className="cursor-pointer font-semibold text-[var(--navy)]">
                {faq.question}
              </summary>
              <p className="mt-4 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
