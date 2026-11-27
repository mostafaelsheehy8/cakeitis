"use client";

import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { EVENT_REFERENCE_GUESTS, EVENT_REFERENCE_PRICE, estimateEventTotal, formatEGP } from "@/lib/config";

export default function EventsPage() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [guests, setGuests] = useState("");
  const [sentEstimate, setSentEstimate] = useState(0);
  const guestCount = Number(guests);
  const estimate = Number.isInteger(guestCount) && guestCount <= 5000 ? estimateEventTotal(guestCount) : 0;
  const minDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setState("sending");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send the request");
      setSentEstimate(data.estimatedTotal ?? 0);
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("idle");
    }
  }

  if (state === "sent")
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-5xl">🍰</p>
        <h1 className="mt-4 font-serif text-4xl text-rose">Request received!</h1>
        <p className="mt-3 text-muted">
          Thanks for thinking of Cakeitis. We&apos;ll call you within 24 hours to talk through flavours and confirm the price.
        </p>
        {sentEstimate > 0 && (
          <p className="mt-4 inline-block rounded-full bg-cream px-4 py-2 font-semibold text-rose">
            Estimated price: {formatEGP(sentEstimate)}
          </p>
        )}
      </div>
    );

  return (
    <>
    <PageHero
      eyebrow="Events & catering"
      title="Let us bring the tiramisu."
      text="Birthdays, engagements, weddings, office days: tell us about your event and get an estimated price right away."
      image="/photos/event-serving.webp"
      imageAlt="Cakeitis team serving tiramisu from the cart at a wedding"
      position="object-[50%_60%]"
      tall
    />
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-[1fr_1.3fr]">
      <div className="h-fit rounded-[2rem] bg-cream/70 p-7 ring-1 ring-cream">
        <h2 className="font-serif text-2xl text-rose-dark">What you get</h2>
        <ul className="mt-5 space-y-4 text-muted">
          <li className="flex gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose text-xs text-white">1</span>
            Our team serves your guests fresh from the Cakeitis cart
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose text-xs text-white">2</span>
            Signature and Classic, mix and match
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose text-xs text-white">3</span>
            Weddings, engagements, birthdays and office days
          </li>
        </ul>
        <p className="mt-6 border-t border-cream pt-5 text-sm text-muted">
          Send the form and we&apos;ll call you within 24 hours to confirm the details and the final price.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-3xl bg-white p-6 ring-1 ring-cream">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">Your name</label>
            <input id="name" name="name" required maxLength={80} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="phone">Mobile number</label>
            <input id="phone" name="phone" required pattern="01[0125][0-9]{8}" title="Egyptian mobile, e.g. 01012345678" inputMode="tel" className="input" placeholder="01xxxxxxxxx" />
          </div>
          <div>
            <label className="label" htmlFor="email">Email (optional)</label>
            <input id="email" name="email" type="email" maxLength={120} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="eventType">Event type</label>
            <select id="eventType" name="eventType" className="input">
              {["Birthday", "Engagement / Wedding", "Corporate", "Graduation", "Other"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="date">Event date</label>
            <input id="date" name="date" type="date" required min={minDate} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="guests">Number of guests</label>
            <input
              id="guests"
              name="guests"
              type="number"
              required
              min={1}
              max={5000}
              className="input"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="location">Location</label>
            <input id="location" name="location" required maxLength={200} className="input" placeholder="Venue or area" />
          </div>
          <div className="sm:col-span-2 rounded-2xl bg-cream p-4">
            <p className="text-sm font-semibold text-rose">Estimated price</p>
            {estimate > 0 ? (
              <p className="mt-1 text-2xl font-bold text-rose">
                {formatEGP(estimate)}{" "}
                <span className="text-sm font-normal text-muted">for {guestCount} guests</span>
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted">Enter the number of guests to see an estimate.</p>
            )}
            <p className="mt-1 text-xs text-muted">
              About {formatEGP(Math.round(EVENT_REFERENCE_PRICE / EVENT_REFERENCE_GUESTS))} per guest. We&apos;ll confirm
              the final price when we call you.
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" rows={3} maxLength={1000} className="input" placeholder="Flavours you like, allergies, theme…" />
          </div>
        </div>
        {/* Honeypot for spam bots: hidden from people and screen readers */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <button type="submit" disabled={state === "sending"} className="btn w-full">
          {state === "sending" ? "Sending…" : "Send booking request"}
        </button>
      </form>
    </div>
    </>
  );
}
