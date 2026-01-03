"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/date-utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { CardSkeleton } from "@/components/ui/loading-skeleton";

interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  renewalDate?: string | null;
  status: "active" | "expired" | "pending" | "inactive" | "cancelled";
  category?: string;
  paymentMethod?: string;
  startDate?: string;
}

interface DashboardContentProps {
  subscriptions: Subscription[];
}

export default function DashboardContent({
  subscriptions,
}: DashboardContentProps) {
  const router = useRouter();
  const [loading] = useState(false);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Loading your subscriptions...
          </p>
        </div>
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active"
  );
  const totalSubscriptions = subscriptions.length;

  // Helper function to calculate renewal date if missing (backend has bug in pre-save hook)
  function getRenewalDate(sub: Subscription): Date | null {
    // First try to get existing renewal date
    const renewalDateStr = sub.renewalDate || (sub as any).renewaltDate;
    if (renewalDateStr) {
      const date = new Date(renewalDateStr);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    // If no renewal date, calculate it from startDate and frequency
    const startDateStr = sub.startDate || (sub as any).startDate;
    if (startDateStr && sub.frequency) {
      const startDate = new Date(startDateStr);
      if (!isNaN(startDate.getTime())) {
        const renewalDate = new Date(startDate);
        const renewalPeriods: Record<string, number> = {
          daily: 1,
          weekly: 7,
          monthly: 30,
          yearly: 365,
        };
        const daysToAdd = renewalPeriods[sub.frequency] || 30;
        renewalDate.setDate(renewalDate.getDate() + daysToAdd);
        return renewalDate;
      }
    }

    return null;
  }

  // Calculate upcoming renewals (next 7 days)
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparison
  const sevenDaysFromNow = new Date(now);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7); // 7 days from today
  sevenDaysFromNow.setHours(23, 59, 59, 999); // End of the 7th day

  const upcomingRenewals = subscriptions.filter((s) => {
    // Only show active subscriptions
    if (s.status !== "active") return false;

    // Get renewal date (calculate if missing)
    const renewalDate = getRenewalDate(s);
    if (!renewalDate) {
      return false;
    }

    try {
      // Check if renewal date is today or within the next 7 days
      // Compare timestamps for accurate comparison
      const renewalTimestamp = renewalDate.getTime();
      const nowTimestamp = now.getTime();
      const sevenDaysTimestamp = sevenDaysFromNow.getTime();

      return (
        renewalTimestamp >= nowTimestamp &&
        renewalTimestamp <= sevenDaysTimestamp
      );
    } catch (error) {
      console.warn(
        "Error processing renewal date for subscription:",
        s.id,
        s.name,
        error
      );
      return false;
    }
  });

  // Sort by renewal date (soonest first)
  upcomingRenewals.sort((a, b) => {
    const dateA = getRenewalDate(a);
    const dateB = getRenewalDate(b);
    if (!dateA || !dateB) return 0;
    return dateA.getTime() - dateB.getTime();
  });

  // Add calculated renewal dates to subscriptions for display
  const subscriptionsWithRenewalDates = subscriptions.map((sub) => {
    const calculatedRenewalDate = getRenewalDate(sub);
    return {
      ...sub,
      renewalDate:
        sub.renewalDate ||
        (sub as any).renewaltDate ||
        calculatedRenewalDate?.toISOString(),
    };
  });

  // Calculate total monthly cost (convert yearly to monthly)
  const totalMonthlyCost = subscriptions
    .filter((s) => s.status === "active")
    .reduce((total, sub) => {
      let monthlyPrice = sub.price;
      if (sub.frequency === "yearly") {
        monthlyPrice = sub.price / 12;
      } else if (sub.frequency === "weekly") {
        monthlyPrice = sub.price * 4.33; // Approximate weeks per month
      } else if (sub.frequency === "daily") {
        monthlyPrice = sub.price * 30; // Approximate days per month
      }
      return total + monthlyPrice;
    }, 0);

  // Group subscriptions by category
  const subscriptionsByCategory = subscriptions.reduce((acc, sub) => {
    const category = sub.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(sub);
    return acc;
  }, {} as Record<string, Subscription[]>);

  if (subscriptions.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Welcome to your subscription dashboard
          </p>
        </div>
        <EmptyState
          title="No subscriptions yet"
          description="Get started by adding your first subscription to start tracking your recurring payments."
          action={
            <Link
              href="/subscriptions/new"
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg text-white bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-gray-100 transition-all duration-200"
            >
              Add Subscription
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Overview of your subscriptions and spending
          </p>
        </div>
        <Link
          href="/subscriptions/new"
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg text-black bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-gray-100 transition-all duration-200"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Subscription
        </Link>
      </div>

      <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Subscriptions
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {totalSubscriptions}
              </p>
            </div>
            <div className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <svg
                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Active Subscriptions
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {activeSubscriptions.length}
              </p>
            </div>
            <div className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <svg
                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Upcoming Renewals
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {upcomingRenewals.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Next 7 days
              </p>
            </div>
            <div className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <svg
                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Total Monthly Cost Card */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm mb-8 transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Total Monthly Cost
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {subscriptions.length > 0 ? subscriptions[0].currency : "USD"}{" "}
              {totalMonthlyCost.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Based on active subscriptions
            </p>
          </div>
          <div className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <svg
              className="w-5 h-5 text-gray-700 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            All Subscriptions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Renewal Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {subscriptionsWithRenewalDates.map((subscription) => (
                <tr
                  key={subscription.id}
                  onClick={() =>
                    router.push(`/subscriptions/${subscription.id}`)
                  }
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer focus-within:bg-gray-50 dark:focus-within:bg-gray-800"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/subscriptions/${subscription.id}`);
                    }
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {subscription.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 capitalize">
                      {subscription.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {subscription.currency} {subscription.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {subscription.frequency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {subscription.renewalDate
                      ? formatDate(subscription.renewalDate)
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={subscription.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Renewals Section */}
      {upcomingRenewals.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm mb-8">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Upcoming Renewals
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Next 7 days
          </p>
          <div className="space-y-3">
            {upcomingRenewals.map((subscription) => {
              const renewalDate = getRenewalDate(subscription);
              return (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors hover:border-gray-300 dark:hover:border-gray-600"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {subscription.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {subscription.category && (
                        <span className="capitalize">
                          {subscription.category} •{" "}
                        </span>
                      )}
                      Renews on{" "}
                      {renewalDate
                        ? formatDate(renewalDate.toISOString())
                        : "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {subscription.currency} {subscription.price}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {Object.keys(subscriptionsByCategory).length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Subscriptions by Category
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(subscriptionsByCategory).map(([category, subs]) => (
              <div
                key={category}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors hover:border-gray-300 dark:hover:border-gray-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {category}
                  </h3>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {subs.length}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {subs.filter((s) => s.status === "active").length} active
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
