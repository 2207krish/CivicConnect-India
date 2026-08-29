import type { Metadata } from "next";

import { LegalLink, LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Terms of Service · ${siteConfig.name}`,
  description:
    "Terms for using the CivicConnect India website and Android app to file and track civic complaints.",
};

export default function TermsOfServicePage() {
  const { developer } = siteConfig;

  return (
    <LegalPage eyebrow="Legal" title="Terms of Service" updated="24 August 2026">
      <p>
        These terms govern your use of the CivicConnect India website and
        Android app (together, the “Service”), operated by {developer.name}.
        By creating an account or using CivicConnect you agree to these terms
        and to our <LegalLink href="/privacy">Privacy Policy</LegalLink>.
      </p>

      <LegalSection title="1. What CivicConnect is">
        <p>
          CivicConnect is a routing tool. It matches your address to civic
          desks in our directory and emails your complaint to that office. We
          do not represent any municipal corporation, DISCOM, water board or
          traffic police. We do not investigate, sanction or close civic
          issues on behalf of the government.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility">
        <p>
          You must be at least 18 years old and able to enter a contract under
          Indian law. You must provide a real name, working email, mobile
          number and residential address. Demo credentials on the site are only
          for trying the interface.
        </p>
      </LegalSection>

      <LegalSection title="3. Accounts">
        <p>
          You are responsible for keeping your password confidential and for
          activity on your account. Verify your email with the 6-digit token
          before filing complaints. We may suspend accounts that are abusive,
          automated, or used with false details.
        </p>
      </LegalSection>

      <LegalSection title="4. Complaints you file">
        <p>
          You confirm that the facts you submit are true to the best of your
          knowledge and that you have the right to share any photos. Complaints
          are sent as written by you. Do not use CivicConnect for emergencies
          (call local police, fire or ambulance services instead), threats,
          defamation, or issues unrelated to civic infrastructure.
        </p>
        <p>
          We do not guarantee that a civic body will read, acknowledge or
          resolve your complaint. Response times and outcomes belong to that
          office.
        </p>
      </LegalSection>

      <LegalSection title="5. Tracking IDs">
        <p>
          After a complaint is filed you receive a CivicConnect tracking ID.
          Anyone who has that ID can view the public status. Keep it private if
          you do not want others to see the record.
        </p>
      </LegalSection>

      <LegalSection title="6. Android app">
        <p>
          The official APK is offered from this website at{" "}
          <LegalLink href="/download">/download</LegalLink>. Installing an APK
          outside Google Play requires you to allow installs from your browser
          and to accept the usual Android security prompts. We are not
          responsible for copies of the app obtained from other websites.
        </p>
        <p>
          On a physical phone you must point the app at the live CivicConnect
          server URL. Features such as login, email tokens and tracking will
          not work without that connection.
        </p>
      </LegalSection>

      <LegalSection title="7. Advertising">
        <p>
          The Service may display third-party ads (Google AdSense on the web,
          Google AdMob in the app). Ads are provided by those networks under
          their own policies. Do not click your own ads.
        </p>
      </LegalSection>

      <LegalSection title="8. Acceptable use">
        <ul className="list-disc space-y-1 pl-5">
          <li>Do not attempt to break, scrape or overload the Service</li>
          <li>Do not impersonate another person or civic official</li>
          <li>Do not upload malware or illegal content</li>
          <li>Do not use CivicConnect to spam civic-body inboxes</li>
        </ul>
      </LegalSection>

      <LegalSection title="9. Intellectual property">
        <p>
          CivicConnect name, design and software belong to the operator. Civic
          body names and emails in the directory are used only to help you
          reach the right desk. You keep ownership of the complaint text and
          photos you submit, and you grant us a licence to store them and to
          email them to the matched office.
        </p>
      </LegalSection>

      <LegalSection title="10. Disclaimer and liability">
        <p>
          The Service is provided “as is”. To the fullest extent permitted by
          Indian law, we are not liable for missed emails, civic-body inaction,
          hosting downtime, advertising, or loss arising from information you
          choose to publish in a complaint or tracking page. Nothing in these
          terms limits liability that cannot be limited by law.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes and termination">
        <p>
          We may change these terms or the Service. The “Last updated” date
          will change. We may stop offering CivicConnect or close accounts that
          breach these terms. You may stop using the Service at any time.
        </p>
      </LegalSection>

      <LegalSection title="12. Governing law">
        <p>
          These terms are governed by the laws of India. Courts in India have
          exclusive jurisdiction, without prejudice to any mandatory consumer
          protections that apply to you.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>
          Questions about these terms: {developer.name},{" "}
          <a className="font-semibold text-[var(--saffron)]" href={`mailto:${developer.email}`}>
            {developer.email}
          </a>
          . Feedback and bugs:{" "}
          <LegalLink href="/contact">Contact</LegalLink>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
