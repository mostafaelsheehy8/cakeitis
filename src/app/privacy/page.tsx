import { contact } from "@/lib/contact";

export const metadata = {
  title: "Privacy — Cakeitis",
  description: "What information Cakeitis collects when you order or book an event, and how it is used.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-14 text-espresso">
      <h1 className="font-serif text-4xl text-rose">Privacy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: November 2026</p>

      <div className="mt-8 space-y-6 leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-rose-dark">What we collect</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>When you order:</strong> your name, mobile number, area, delivery address and any notes you add.</li>
            <li><strong>When you book an event:</strong> your name, mobile number, email if you give it, and the event details (date, location, number of guests, notes).</li>
          </ul>
          <p className="mt-2">We don&apos;t ask for card details. Orders are paid in cash on delivery.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-rose-dark">How we use it</h2>
          <p className="mt-2">
            Only to prepare and deliver your order, to call or message you about it, and to plan your event. When a new
            order or booking comes in, the details are sent to the Cakeitis team as a private message so we can confirm it quickly.
          </p>
          <p className="mt-2">We don&apos;t sell your information or share it with anyone for advertising.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-rose-dark">Where it is kept</h2>
          <p className="mt-2">
            Your order and booking details are stored in our database so we can look up your order. Your cart is kept
            only in your own browser until you place the order. We don&apos;t use advertising or tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-rose-dark">Your choices</h2>
          <p className="mt-2">
            If you&apos;d like us to delete your details or have a question about this page,{" "}
            {contact.whatsappHref ? (
              <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-rose underline">
                message us on WhatsApp
              </a>
            ) : (
              "contact us"
            )}
            .
          </p>
        </section>
      </div>
    </article>
  );
}
