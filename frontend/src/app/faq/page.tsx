import { type Metadata } from "next";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — CivicConnect India",
  description:
    "Frequently asked questions about registering, filing complaints, email verification, complaint routing, and tracking your civic issue with CivicConnect India.",
};

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
  {
    question: "How many cities and civic bodies are covered?",
    answer:
      "We currently have 20 cities mapped with 60+ civic desks on file, covering municipal corporations, state electricity DISCOMs, water boards, and traffic police units. More are added regularly.",
  },
  {
    question: "Is the Android app the same as the website?",
    answer:
      "Yes. The Android app uses the same CivicConnect server. Complaints and tracking IDs stay in sync — file on the app, track on the web, or vice versa.",
  },
  {
    question: "My PIN code isn't matched — what should I do?",
    answer:
      "If your exact PIN code isn't in our database, the system falls back to your city and state. You'll still be matched to the city-level civic body. You can also contact us to request your area be added.",
  },
];

const categories = [
  { title: "Account & Registration", ids: [0, 1, 5] },
  { title: "Routing & Complaints", ids: [2, 3, 8, 9] },
  { title: "Tracking & Guide", ids: [4, 6, 7] },
];

export default function FAQPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-[var(--navy)] py-20 text-white">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Support
          </p>
          <h1 className="font-display mt-4 text-5xl leading-tight lg:text-6xl">
            Frequently asked questions
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Everything you need to know about registering, filing complaints,
            and tracking them — answered plainly.
          </p>
        </Container>
      </section>

      {/* FAQ accordion */}
      <section className="bg-[#efe7d8] py-24">
        <Container>
          <div className="mx-auto max-w-3xl space-y-10">
            {categories.map((cat) => (
              <div key={cat.title}>
                <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--saffron)]">
                  {cat.title}
                </h2>
                <div className="space-y-4">
                  {cat.ids.map((i) => {
                    const faq = faqs[i];
                    return (
                      <details
                        key={faq.question}
                        className="group rounded-2xl border border-[#e5dccb] bg-white p-5 shadow-sm open:shadow-md transition-shadow duration-200"
                      >
                        <summary className="flex cursor-pointer items-center justify-between font-semibold text-[var(--navy)] [&::-webkit-details-marker]:hidden">
                          {faq.question}
                          <span className="ml-4 shrink-0 text-[var(--saffron)] transition-transform duration-200 group-open:rotate-45">
                            +
                          </span>
                        </summary>
                        <p className="mt-4 leading-7 text-slate-600">
                          {faq.answer}
                        </p>
                      </details>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Still have questions */}
      <section className="py-20">
        <Container>
          <div className="rounded-3xl border border-[#e5dccb] bg-white p-10 text-center shadow-sm md:p-16">
            <h2 className="font-display text-4xl text-[var(--navy)]">
              Still have questions?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              Reach out via our contact page or explore the civic awareness guide
              for deeper explanations.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/contact">Contact us</Button>
              <Button variant="outline" href="/learn">
                Civic awareness guide
              </Button>
            </div>
            <p className="mt-6 text-sm text-slate-400">
              Or try the{" "}
              <Link
                href="/track"
                className="font-semibold text-[var(--saffron)] hover:underline"
              >
                complaint tracker
              </Link>{" "}
              if you already have a CivicConnect ID.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
