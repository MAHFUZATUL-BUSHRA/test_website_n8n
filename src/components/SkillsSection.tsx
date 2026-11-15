import { EXPERIENCE_TIMELINE, SKILL_GROUPS } from '../data/portfolioContext';

export function SkillsSection() {
  return (
    <section id="skills" className="py-20 bg-white border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-sm font-medium text-[#2563EB]">Skills & Architecture</p>
            <h2
              className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[#0A0B0D]"
              style={{ textWrap: 'balance' }}
            >
              Full-stack mastery from kernel telemetry to 120fps interfaces.
            </h2>
          </div>
          <p className="lg:col-span-5 text-sm md:text-[15px] leading-relaxed text-zinc-600">
            Every tool in my stack is battle-tested in multi-region production environments—prioritizing type safety, observability, and predictable latency budgets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 pt-4 border-t border-zinc-200">
          {SKILL_GROUPS.map((group) => (
            <div key={group.index} className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-display text-lg font-semibold text-[#0A0B0D]">
                  <span className="font-mono text-sm text-[#2563EB] mr-2 tabular-nums">
                    {group.index}
                  </span>
                  {group.title}
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {group.description}
                </p>
              </div>

              <dl className="divide-y divide-zinc-200/80 border-t border-zinc-200/80">
                {group.items.map((skill) => (
                  <div key={skill.name} className="py-3.5 space-y-1">
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-sm font-semibold text-[#0A0B0D]">
                        {skill.name}
                      </dt>
                      <dd className="font-mono tabular-nums text-xs text-zinc-500 shrink-0">
                        {skill.years}
                      </dd>
                    </div>
                    <dd className="text-xs text-zinc-600 leading-relaxed">
                      {skill.context}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="pt-12 border-t border-zinc-200 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h3 className="font-display text-xl font-bold tracking-tight text-[#0A0B0D]">
              Experience Ledger
            </h3>
            <p className="text-xs text-zinc-500">
              Selected engineering leadership roles · 2017–Present
            </p>
          </div>

          <div className="divide-y divide-zinc-200 border-y border-zinc-200">
            {EXPERIENCE_TIMELINE.map((item) => (
              <div
                key={item.company}
                className="py-5 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-baseline"
              >
                <div className="md:col-span-3 font-mono tabular-nums text-xs text-zinc-500">
                  {item.period}
                </div>
                <div className="md:col-span-4">
                  <p className="text-sm font-semibold text-[#0A0B0D]">
                    {item.role}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {item.company}
                    <span aria-hidden="true" className="mx-1.5 text-zinc-300">
                      ·
                    </span>
                    {item.location}
                  </p>
                </div>
                <p className="md:col-span-5 text-sm text-zinc-600 leading-relaxed">
                  {item.highlight}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
