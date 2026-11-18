"use client";

import { useState } from "react";

export default function EventsPage() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
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
        <h1 className="mt-4 font-serif text-4xl text-cocoa">Request received!</h1>
        <p className="mt-3 text-mocha">
          Thanks for thinking of Cakeitis. We&apos;ll call you within 24 hours to talk through flavours, quantities and a quote.
        </p>
      </div>
    );

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-[1fr_1.3fr]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-caramel">Events & catering</p>
        <h1 className="mt-2 font-serif text-4xl text-cocoa">Let us bring the tiramisu.</h1>
        <p className="mt-4 text-mocha">
          Birthdays, engagements, weddings, office days: tell us about your event and we&apos;ll put together a dessert
          table that fits your guests and budget.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-mocha">
          <li>✓ Mix and match any flavours</li>
          <li>✓ Individual cups or large trays</li>
          <li>✓ Delivery and setup at your venue</li>
        </ul>
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
            <input id="guests" name="guests" type="number" required min={1} max={5000} className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="location">Location</label>
            <input id="location" name="location" required maxLength={200} className="input" placeholder="Venue or area" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="budget">Budget in EGP (optional)</label>
            <input id="budget" name="budget" type="number" min={0} step={50} className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" rows={3} maxLength={1000} className="input" placeholder="Flavours you like, allergies, theme…" />
          </div>
        </div>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <button type="submit" disabled={state === "sending"} className="btn w-full">
          {state === "sending" ? "Sending…" : "Send booking request"}
        </button>
      </form>
    </div>
  );
}
