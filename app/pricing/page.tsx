'use client';

import { Fragment, useState } from 'react';
import { RadioGroup } from '@headlessui/react';

import { CheckCircleIcon } from '@/components/icons/check-circle';
import { PricingSection } from "@/components/sections/pricing"

const comparisonTable = [
  {
    category: 'Core Functionality',
    features: [
      { name: 'Job Queues', free: true, pro: true, ultra: true },
      { name: 'Multiple Backends', free: true, pro: true, ultra: true },
      { name: 'Job Scheduling (Cron)', free: true, pro: true, ultra: true },
      { name: 'Realtime Web UI', free: true, pro: true, ultra: true },
      { name: 'Advanced Retry Logic', free: false, pro: true, ultra: true },
    ],
  },
  {
    category: 'Performance & Scaling',
    features: [
      { name: 'Concurreny', free: true, pro: true, ultra: true },
      { name: 'Rate Limitting', free: true, pro: true, ultra: true },
      { name: 'Batch Processing', free: false, pro: true, ultra: true },
      { name: 'Bulk Job Inserts', free: "Not Guaranteed", pro: true, ultra: true },
      { name: 'Pausable/Resumable Queues', free: false, pro: true, ultra: true },
    ],
  },
  {
    category: 'Advanced Features',
    features: [
      { name: 'Job Prioritization', free: false, pro: true, ultra: true },
      { name: 'Dead Letter Queue Handling', free: false, pro: true, ultra: true },
      { name: 'Custom Job Middleware', free: true, pro: true, ultra: true },
      { name: 'Encryption at Rest', free: false, pro: false, ultra: true },
      { name: 'Advanced Workflow Coordination', free: false, pro: false, ultra: true },
    ],
  },
  {
    category: 'Observability & Monitoring',
    features: [
      { name: 'Job Logs & History', free: false, pro: true, ultra: true },
      { name: 'Error Tracking & Alerts', free: true, pro: true, ultra: true },
      { name: 'Performance Metrics', free: false, pro: true, ultra: true },
      { name: 'Scoped Web UI', free: false, pro: true, ultra: true },
      { name: 'Authentication on Web UI', free: false, pro: true, ultra: true },
      { name: 'Custom Telemetry Backends', free: false, pro: true, ultra: true },
      { name: 'Logs Retention (months)', free: false, pro: '1', ultra: '3+' },
    ],
  },
  {
    category: 'Support & SLA',
    features: [
      { name: 'Community Support (GitHub)', free: true, pro: true, ultra: true },
      { name: 'Email & Chat Support', free: false, pro: true, ultra: true },
      { name: 'Priority Response Time', free: false, pro: '24h', ultra: '2h' },
      { name: 'Dedicated Account Manager', free: false, pro: false, ultra: true },
      { name: 'SLA Guarantees', free: false, pro: false, ultra: true },
    ],
  },
  {
    category: 'Customization & Enterprise',
    features: [
      { name: 'Custom Feature Requests', free: false, pro: true, ultra: true },
      { name: 'Custom Telemetry', free: false, pro: true, ultra: true },
      { name: 'Collaborative Coding Sessions', free: false, pro: false, ultra: true },
      { name: 'Priority Feature requests', free: false, pro: false, ultra: true },
    ],
  },
]

export default function Pro() {
  return <div className="min-h-screen w-full">
    <PricingSection />
    {/* Feature Comparison Section */}
    <section className="w-full px-5 py-12 md:py-20 flex flex-col justify-center items-center">
      <div className="w-full flex flex-col justify-center items-center gap-12 p-2">
        <div className="flex flex-col justify-center items-center gap-2">
          <h2 id='detailed-comparison' className="text-center dark:text-foreground text-4xl md:text-5xl font-semibold leading-tight">
            Detailed Feature Comparison
          </h2>
          <p className="text-center dark:text-muted-foreground text-sm md:text-base font-medium leading-relaxed">
            See exactly what's included in each plan
          </p>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 font-semibold text-foreground bg-muted/30 rounded-tl-lg">
                  Features
                </th>
                <th className="text-center px-6 py-4 font-semibold text-foreground bg-muted/30">
                  Free
                </th>
                <th className="text-center px-6 py-4 font-semibold text-foreground bg-muted/30">
                  Pro
                </th>
                <th className="text-center px-6 py-4 font-semibold text-foreground bg-muted/30 rounded-tr-lg">
                  Ultra
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonTable.map((section, sectionIdx) => (
                <Fragment key={section.category}>
                  <tr >
                    <td colSpan={4} className="px-6 py-4 bg-accent/5 border-b border-border">
                      <h3 className="text-sm font-semibold dark:text-foreground">{section.category}</h3>
                    </td>
                  </tr>
                  {section.features.map((feature, idx) => (
                    <tr
                      key={feature.name}
                      className="border-b border-border hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm dark:text-foreground font-medium">
                        {feature.name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof feature.free === 'boolean' ? (
                          feature.free ? (
                            <div className="flex justify-center">
                              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                              </div>
                            </div>
                          ) : (
                            <span className="dark:text-muted-foreground text-sm">—</span>
                          )
                        ) : (
                          <span className="text-sm dark:text-foreground font-medium">{feature.free}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof feature.pro === 'boolean' ? (
                          feature.pro ? (
                            <div className="flex justify-center">
                              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                              </div>
                            </div>
                          ) : (
                            <span className="dark:text-muted-foreground text-sm">—</span>
                          )
                        ) : (
                          <span className="text-sm dark:text-foreground font-medium">{feature.pro}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof feature.ultra === 'boolean' ? (
                          feature.ultra ? (
                            <div className="flex justify-center">
                              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                              </div>
                            </div>
                          ) : (
                            <span className="dark:text-muted-foreground text-sm">—</span>
                          )
                        ) : (
                          <span className="text-sm dark:text-foreground font-medium">{feature.ultra}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>


    {/* CTA Section */}
    <section className="w-full px-5 py-12 md:py-20 flex flex-col justify-center items-center">
      <div className="max-w-2xl w-full flex flex-col justify-center items-center gap-8 p-8 md:p-12 rounded-lg bg-linear-to-br from-accent/10 to-accent/5 border border-accent/20">
        <div className="flex flex-col justify-center items-center gap-3">
          <h2 className="text-center dark:text-foreground text-3xl md:text-4xl font-semibold">
            Ready to get started?
          </h2>
          <p className="text-center dark:text-muted-foreground text-base md:text-lg">
            Choose your plan and start building today. Upgrade or downgrade anytime.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <a href='mailto:sales@apalis.dev' className="mx-auto px-6 py-3 rounded-md border border-border dark:text-foreground font-semibold dark:hover:bg-muted transition-colors">
            Talk to Sales
          </a>
        </div>
      </div>
    </section>
  </div>
}
