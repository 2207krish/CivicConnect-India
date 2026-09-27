import type { Metadata } from "next";

import { LegalLink, LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Privacy Policy · ${siteConfig.name}`,
  description:
    "How CivicConnect India collects, uses and shares personal information for civic complaint routing.",
};

export default function PrivacyPolicyPage() {
  const { developer } = siteConfig;

  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="27 September 2026">
      <p>
        CivicConnect India (“CivicConnect”, “we”, “us”) is a citizen grievance
        routing service operated by {developer.name}. This policy explains what
        we collect when you use the website or the Android app, why we collect
        it, and how you can reach us.
      </p>

      <LegalSection title="1. Who we are">
        <p>
          CivicConnect helps you register, match the nearest municipal,
          electricity, water or traffic desk, and email a complaint to that
          office. We are not a government department and we do not decide
          complaints.
        </p>
        <p>
          Contact:{" "}
          <a className="font-semibold text-[var(--saffron)]" href={`mailto:${developer.email}`}>
            {developer.email}
          </a>
          . See also our <LegalLink href="/contact">Contact</LegalLink> page.
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <p>When you create an account we ask for:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Full name</li>
          <li>Email address</li>
          <li>10-digit mobile number</li>
          <li>Residential address (house/street, locality, city, state, PIN code)</li>
          <li>Password (stored in hashed form, not as plain text)</li>
        </ul>
        <p>When you use the service we may also store:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Email verification and password-reset tokens, for a short time</li>
          <li>Login session (cookie <code>cc_session</code> on the website; a session token in the Android app)</li>
          <li>
            Complaint details: title, description, landmark, category, address,
            tracking ID, status timeline, and any photos you attach
          </li>
          <li>Feedback you send through the contact form</li>
          <li>The CivicConnect server URL you enter in the Android app (saved on the device)</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How we use this information">
        <ul className="list-disc space-y-1 pl-5">
          <li>To create and secure your citizen account</li>
          <li>To email a 6-digit verification or password-reset token</li>
          <li>To match nearby civic bodies from your address and PIN code</li>
          <li>
            To send your complaint to the matched civic body’s registered email
            desk, including your name, phone, address and issue details
          </li>
          <li>To let you track the complaint with your CivicConnect ID</li>
          <li>To respond to feedback, bugs and modification requests</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. What we share">
        <p>
          <strong>Civic bodies.</strong> Filing a complaint emails the selected
          office. That message includes the information needed to act on the
          issue. We do not control how that office stores or uses the email.
        </p>
        <p>
          <strong>Public tracking.</strong> Anyone with the tracking ID can view
          the public status of that complaint. Do not share the ID if you want
          the record to stay private.
        </p>
        <p>
          <strong>Email delivery.</strong> Verification, password reset and
          complaint copies are sent through our configured mail provider
          (currently SMTP / Gmail for this deployment).
        </p>
        <p>
          <strong>Advertising.</strong> The website may show Google AdSense ads.
          The Android app may show Google AdMob ads. Google may collect device
          or cookie identifiers as described in{" "}
          <a
            className="font-semibold text-[var(--saffron)]"
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
          >
            Google’s Privacy Policy
          </a>
          .
        </p>
        <p>We do not sell your personal information.</p>
      </LegalSection>

      <LegalSection title="5. Cookies and similar technology">
        <p>
          The website uses an HttpOnly session cookie named <code>cc_session</code>{" "}
          so you stay signed in. You can block cookies in your browser; some
          features such as login will then not work.
        </p>
        <p>
          <strong>DoubleClick DART cookies.</strong> Third-party advertising
          vendors, including Google, use the DoubleClick DART cookie to serve
          ads on CivicConnect based on your visits to this site and other sites
          on the Internet. The DART cookie is set by Google&apos;s ad-serving
          technology and is used to track the ads that have been served to your
          browser, the websites you have visited, and whether you have taken
          any action on an ad (such as clicking it). The DART cookie is not used
          by Google to track personally identifiable information about you.
        </p>
        <p>
          <strong>Third-party ad cookies.</strong> Third-party vendors,
          including Google, use cookies to serve ads based on a user&apos;s prior
          visits to CivicConnect and other websites. Google&apos;s use of advertising
          cookies enables it and its partners to serve ads to our users based
          on their visit to CivicConnect and/or other sites on the Internet.
        </p>
        <p>
          <strong>Opting out of personalised advertising.</strong> You may opt
          out of personalised advertising by visiting{" "}
          <a
            className="font-semibold text-[var(--saffron)]"
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noreferrer"
          >
            Google&apos;s Ads Settings
          </a>
          . Alternatively, you can opt out of a third-party vendor&apos;s use of
          cookies for personalised advertising by visiting{" "}
          <a
            className="font-semibold text-[var(--saffron)]"
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noreferrer"
          >
            www.aboutads.info/choices
          </a>
          . You may also visit the{" "}
          <a
            className="font-semibold text-[var(--saffron)]"
            href="https://optout.networkadvertising.org/"
            target="_blank"
            rel="noreferrer"
          >
            Network Advertising Initiative opt-out page
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="6. Third-party advertising">
        <p>
          CivicConnect uses Google AdSense to display advertisements on the
          website and Google AdMob to display advertisements in the Android
          app. These services are provided by Google LLC. Google, as a
          third-party vendor, uses cookies — including the DoubleClick DART
          cookie — to serve ads based on your prior visits to CivicConnect
          and other websites.
        </p>
        <p>Specifically:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Google uses the DoubleClick DART cookie to enable it and its
            partners to serve ads to you based on your visit to CivicConnect
            and/or other websites on the Internet.
          </li>
          <li>
            Google may collect and use anonymous data (not including your name,
            address, email address, or telephone number) about your visits to
            this and other websites in order to provide advertisements about
            goods and services of interest to you.
          </li>
          <li>
            You may opt out of the use of the DART cookie by visiting the{" "}
            <a
              className="font-semibold text-[var(--saffron)]"
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noreferrer"
            >
              Google Ads Settings page
            </a>
            .
          </li>
          <li>
            For more information about how Google manages data in its ads
            products, visit{" "}
            <a
              className="font-semibold text-[var(--saffron)]"
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noreferrer"
            >
              Google&apos;s Partner Sites policy
            </a>
            .
          </li>
        </ul>
        <p>
          We do not have access to or control over cookies that are used by
          third-party advertisers. We encourage you to read the respective
          privacy policies of these third-party ad servers for more
          information.
        </p>
      </LegalSection>

      <LegalSection title="7. Retention">
        <p>
          Account, complaint and feedback records are kept while they are needed
          to run the service and to let you track cases. Verification and reset
          tokens expire after a short period (about 15 minutes). You may ask us
          to correct or delete your account data using the contact details
          above, except where a complaint has already been emailed to a civic
          body (that copy is outside our control).
        </p>
      </LegalSection>

      <LegalSection title="8. Children’s privacy">
        <p>
          CivicConnect is meant for adults who can file civic complaints. Do not
          create an account for a child under 18. If you believe we hold such
          data, email {developer.email} and we will delete it.
        </p>
      </LegalSection>

      <LegalSection title="9. Your choices (including DPDP)">
        <p>
          Subject to the Digital Personal Data Protection Act, 2023 and other
          applicable Indian law, you may request access, correction or erasure
          of personal data we hold, or withdraw consent where processing is
          based on consent. Login, complaint filing and email routing cannot
          work without the details listed above.
        </p>
      </LegalSection>

      <LegalSection title="10. Security">
        <p>
          We use hashed passwords, session cookies and HTTPS when the site is
          hosted with TLS. No method of transmission or storage is completely
          secure. Do not reuse your CivicConnect password on other services.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes">
        <p>
          We may update this policy when the product changes. The “Last updated”
          date at the top will change. Continued use after an update means you
          accept the revised policy.
        </p>
      </LegalSection>

      <LegalSection title="12. Related terms">
        <p>
          Use of CivicConnect is also governed by our{" "}
          <LegalLink href="/terms">Terms of Service</LegalLink>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
