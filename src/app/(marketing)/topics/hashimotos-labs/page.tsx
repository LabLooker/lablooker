import type { Metadata } from 'next'
import Link from 'next/link'
import { GuideBundleCard } from '../GuideBundleCard'

export const metadata: Metadata = {
  title: "Hashimoto's Lab Tests: Which Markers to Order and Why | LabLooker",
  description:
    "TPO antibodies, Free T3, Free T4, Reverse T3 — the complete lab panel for Hashimoto's thyroiditis diagnosis and monitoring. Learn why TSH alone isn't enough.",
  alternates: { canonical: 'https://lablooker.com/topics/hashimotos-labs' },
  openGraph: {
    title: "Hashimoto's Lab Tests: Which Markers to Order and Why | LabLooker",
    description:
      "TPO antibodies, Free T3, Free T4, Reverse T3 — the complete lab panel for Hashimoto's thyroiditis diagnosis and monitoring.",
    url: 'https://lablooker.com/topics/hashimotos-labs',
  },
}

const FAQ = [
  {
    q: "What is the most important lab test for diagnosing Hashimoto's?",
    a: "TPO antibodies (thyroid peroxidase antibodies) are the most diagnostic marker for Hashimoto's thyroiditis. Elevated TPO Ab confirms autoimmune thyroid disease in the vast majority of cases. TgAb (thyroglobulin antibodies) should also be ordered because roughly 10–15% of people with Hashimoto's have elevated TgAb but normal TPO Ab. TSH alone cannot diagnose Hashimoto's — it measures thyroid function, not the underlying immune attack on the thyroid.",
  },
  {
    q: "Can you have Hashimoto's with a normal TSH?",
    a: "Yes. Hashimoto's is an autoimmune condition that can be active — with elevated antibodies and ongoing tissue damage — while TSH remains within the reference range. Early in the disease, or during fluctuating phases, the thyroid may still produce enough hormone to keep TSH normal. Many people spend years with elevated TPO antibodies, symptoms, and a normal TSH before TSH shifts. This is why antibody testing matters even when TSH looks fine.",
  },
  {
    q: "How often should I retest my thyroid labs with Hashimoto's?",
    a: "Most clinicians retest TSH, Free T4, and Free T3 every 6 to 12 months once stable, or sooner if symptoms change or a dose adjustment is made (usually 6–8 weeks after a change). Antibody levels (TPO Ab, TgAb) don't need to be checked every time — annually or every 1–2 years is reasonable unless tracking response to an intervention like a gluten-free diet or selenium supplementation. Reverse T3 is typically checked only when symptoms persist despite normal TSH and Free T4.",
  },
  {
    q: "Why do I still feel bad if my TSH is normal?",
    a: "TSH is a pituitary signal, not a direct measure of how much active thyroid hormone your cells are using. Several things can go wrong even with a normal TSH: Free T3 may be low (T3 is the active hormone), Reverse T3 may be high (blocking T3 receptors), conversion from T4 to T3 may be impaired by nutrient deficiencies (iron, selenium, zinc) or chronic stress, or autoimmune activity may still be causing inflammation and symptoms independent of hormone levels. A full panel, plus nutrient markers, gives a far more complete picture than TSH alone.",
  },
]

export default function HashimotosLabsGuide() {
  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#577572] mb-8">
          <Link href="/topics" className="hover:text-[#2d6a5e] transition-colors">Topics</Link>
          <span>/</span>
          <Link href="/topics/hashimotos-labs" className="text-[#1a2e2b] font-medium">Hashimoto&apos;s Labs</Link>
        </nav>

        {/* Hero */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1a2e2b] tracking-tight">
          Hashimoto&apos;s lab tests: which markers to order and why
        </h1>
        <p className="mt-4 text-base text-[#4a6b67] leading-relaxed">
          TSH is where most thyroid workups end. For Hashimoto&apos;s thyroiditis, it&apos;s barely where they should begin. Here&apos;s the full panel that actually tells the story.
        </p>

        {/* Content */}
        <div className="mt-10 space-y-6 text-[#4a6b67] leading-relaxed">

          <h2 className="text-xl font-bold text-[#1a2e2b]">Why TSH alone isn&apos;t enough</h2>
          <p>
            TSH — thyroid-stimulating hormone — is a signal from the pituitary gland telling the thyroid to produce more hormone. It&apos;s a useful screening tool, but it measures pituitary feedback, not what&apos;s actually happening in the thyroid or in the cells that depend on thyroid hormone. In Hashimoto&apos;s, the immune system attacks the thyroid gland over time, often causing fluctuating hormone levels, persistent symptoms, and significant antibody elevation — all while TSH sits comfortably in the &ldquo;normal&rdquo; range.
          </p>
          <p>
            Hashimoto&apos;s is the most common cause of hypothyroidism in the developed world. It&apos;s an autoimmune condition, not simply a hormone problem — and that distinction changes what labs matter. A standard TSH check can miss active autoimmune thyroid disease entirely. Antibody testing, free hormone levels, and markers that affect conversion all add critical information that TSH cannot provide.
          </p>

          <h2 className="text-xl font-bold text-[#1a2e2b] pt-2">The core Hashimoto&apos;s panel</h2>

          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-[#1a2e2b]">TSH (Thyroid-Stimulating Hormone)</h3>
              <p>
                Still the first number most clinicians look at, and a useful baseline. Standard lab ranges run roughly 0.5 to 4.5 mIU/L, but many practitioners focused on symptom resolution aim for TSH between 1 and 2 in people with Hashimoto&apos;s. TSH above 2.5 in someone with antibodies and symptoms is worth discussing with a provider even if it&apos;s &ldquo;in range.&rdquo; TSH fluctuates — it&apos;s best interpreted alongside Free T4 and Free T3.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1a2e2b]">Free T4 (Free Thyroxine)</h3>
              <p>
                T4 is the main hormone the thyroid produces and secretes. &ldquo;Free&rdquo; means the unbound, active portion — not attached to carrier proteins. Low Free T4 suggests the thyroid is underproducing. The goal for most people with Hashimoto&apos;s is a Free T4 in the upper half of the reference range, around 1.1 to 1.8 ng/dL depending on the lab. A normal TSH with a low Free T4 is a red flag that warrants attention.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1a2e2b]">Free T3 (Free Triiodothyronine)</h3>
              <p>
                T3 is the active form of thyroid hormone — the one cells actually use. Most of it is converted from T4 in peripheral tissues, not produced directly by the thyroid. Someone can have normal TSH and T4 but still be low in Free T3 due to impaired conversion. Free T3 is particularly valuable in people who report ongoing symptoms (fatigue, brain fog, cold intolerance, weight gain) despite a normal TSH. A Free T3 in the lower portion of the range while symptomatic is often meaningful.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1a2e2b]">TPO Antibodies (Thyroid Peroxidase Antibodies)</h3>
              <p>
                TPO antibodies are the primary diagnostic marker for Hashimoto&apos;s thyroiditis. Thyroid peroxidase is an enzyme involved in producing thyroid hormone — when the immune system attacks it, antibody levels rise. The reference range cutoff is usually around 34 IU/mL, but levels can run into the hundreds or thousands in active Hashimoto&apos;s. Elevated TPO Ab confirms autoimmune thyroid disease. Even modestly elevated levels in someone with symptoms are worth noting and monitoring.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1a2e2b]">TgAb (Thyroglobulin Antibodies)</h3>
              <p>
                Thyroglobulin antibodies are the second major antibody marker for Hashimoto&apos;s. Roughly 10–15% of people with Hashimoto&apos;s have elevated TgAb but normal or borderline TPO Ab. Ordering both increases diagnostic sensitivity. TgAb is also important for anyone who has had thyroid cancer, where it&apos;s used to monitor for recurrence — elevated TgAb can interfere with thyroglobulin testing, a different clinical issue but worth knowing.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1a2e2b]">Reverse T3 (RT3)</h3>
              <p>
                Reverse T3 is an inactive isomer of T3 — same atoms, different configuration, and it doesn&apos;t bind to receptors the way active T3 does. The body produces more Reverse T3 under stress, caloric restriction, illness, elevated cortisol, or iron deficiency. A high Reverse T3 relative to Free T3 can functionally block thyroid receptor activity even when T4 levels look fine. It&apos;s not a first-line test, but it&apos;s useful in people who are symptomatic despite otherwise reasonable labs. Some labs offer a Free T3 to Reverse T3 ratio — values above 20 are generally considered favorable.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-[#1a2e2b] pt-2">Optional add-ons that often matter</h2>
          <p>
            Hashimoto&apos;s frequently co-occurs with nutrient deficiencies and other hormonal imbalances that amplify symptoms. These tests are optional from a strict diagnostic standpoint but often change the clinical picture:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-[#1a2e2b]">Ferritin and iron panel</h3>
              <p>
                Iron is required for T4-to-T3 conversion. Low ferritin is extremely common in women with Hashimoto&apos;s and can cause or worsen fatigue, hair loss, and brain fog. A ferritin under 50 ng/mL may impair thyroid hormone conversion even when serum iron looks fine. A full iron panel (ferritin, serum iron, TIBC, transferrin saturation) is worth including in any thorough thyroid workup.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1a2e2b]">Vitamin D</h3>
              <p>
                Vitamin D deficiency is significantly more common in people with autoimmune thyroid disease than in the general population. It plays a role in immune regulation, and low levels are associated with higher antibody titers. Many practitioners target 25-OH Vitamin D between 50 and 80 ng/mL in patients with autoimmune conditions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1a2e2b]">Vitamin B12</h3>
              <p>
                Autoimmune thyroid disease is associated with an increased risk of pernicious anemia, a condition that impairs B12 absorption. B12 deficiency produces symptoms — fatigue, brain fog, numbness, mood changes — that overlap significantly with hypothyroidism. Checking B12 when symptomatic makes sense and is inexpensive.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1a2e2b]">Cortisol (AM)</h3>
              <p>
                Chronic stress and elevated cortisol directly increase Reverse T3 production and can impair thyroid hormone conversion. An AM cortisol test provides a snapshot of adrenal output. It&apos;s most useful when someone&apos;s thyroid numbers look acceptable but symptoms persist, or when there are signs of HPA axis dysregulation (morning fatigue, afternoon crashes, poor stress tolerance).
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-[#1a2e2b] pt-2">What &ldquo;in range&rdquo; vs. optimal actually means</h2>
          <p>
            Lab reference ranges are built from large population samples and are designed to flag disease, not optimize health. For thyroid hormones, the range is wide by design — it includes both people who feel fine and people who are symptomatic at the edges. A Free T3 at the very bottom of the range and a Free T3 in the upper half are both &ldquo;normal,&rdquo; but they represent very different physiological states.
          </p>
          <p>
            For someone with Hashimoto&apos;s, functional medicine and integrative thyroid specialists typically target:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-[#4a6b67]">
            <li>TSH: 1.0 – 2.0 mIU/L</li>
            <li>Free T4: upper half of range (often ~1.1 – 1.8 ng/dL)</li>
            <li>Free T3: upper half to upper third of range (often ~3.0 – 4.0 pg/mL)</li>
            <li>TPO Ab and TgAb: trending down over time, ideally below 35 IU/mL</li>
            <li>Reverse T3: lower end of range; Free T3 / RT3 ratio above 20</li>
          </ul>
          <p>
            These are general targets, not universal prescriptions. What matters more than hitting a specific number is how you feel at different levels — and whether values are trending in the right direction over time.
          </p>

          <h2 className="text-xl font-bold text-[#1a2e2b] pt-2">Tracking labs over time</h2>
          <p>
            Hashimoto&apos;s is a long-term condition. A single snapshot of labs matters less than the trend. Antibody levels can fluctuate, TSH can shift seasonally, and changes in stress, diet, or supplementation all show up in the numbers over months.
          </p>
          <p>
            Keeping a log of your results — with dates and whatever context is relevant (dose change, illness, stress period, started selenium, went gluten-free) — makes it much easier to spot patterns and have useful conversations with your provider. Many people find that tracking their numbers in one place helps them see improvement that would otherwise be invisible appointment to appointment.
          </p>
          <p>
            Frequency of testing depends on how stable things are. Newly diagnosed, recently changed medication, or actively symptomatic usually warrants testing every 6–8 weeks. Stable and feeling well: 6–12 months is reasonable for the core panel, with antibodies maybe annually.
          </p>
        </div>

        {/* Bundle */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-[#1a2e2b] mb-4">The complete thyroid panel</h2>
          <GuideBundleCard bundleSlug="thyroid-complete" />
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-[#e0ebe9] bg-[#faf8f5] p-6 sm:p-8 text-center">
          <h2 className="text-lg font-bold text-[#1a2e2b]">Ready to get your thyroid panel?</h2>
          <p className="mt-2 text-sm text-[#4a6b67]">
            Track your results over time or compare thyroid test prices across labs to find the best value.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/track-results"
              className="inline-flex items-center gap-2 rounded-lg bg-[#b85c5c] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a04f4f]"
            >
              Track my labs
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-lg bg-[#f0f7f6] border border-[#cfe0dc] px-5 py-3 text-sm font-semibold text-[#2d6a5e] transition-colors hover:bg-[#e0ebe9]"
            >
              Compare thyroid test prices
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-[#1a2e2b] mb-6">Frequently asked questions</h2>
          <div className="space-y-6">
            {FAQ.map((item, i) => (
              <div key={i} className="border-b border-[#e0ebe9] pb-6 last:border-0">
                <h3 className="text-base font-semibold text-[#1a2e2b]">{item.q}</h3>
                <p className="mt-2 text-sm text-[#4a6b67] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ.map(item => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.a,
              },
            })),
          }),
        }}
      />
    </div>
  )
}
