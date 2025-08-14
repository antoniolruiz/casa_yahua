import { prisma } from "@/lib/prisma";
import CalendarForm from "@/components/CalendarForm";

export default async function CalendarsAdminPage() {
  const sources = await prisma.calendarSource.findMany({ include: { listing: true }, orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Calendar Sources</h1>
      <CalendarForm />
      <div className="space-y-2">
        {sources.map((s) => (
          <div key={s.id} className="rounded border p-3">
            <div className="text-sm text-gray-600">{s.createdAt.toDateString()}</div>
            <div className="font-medium">{s.name}</div>
            <div className="truncate text-gray-700">{s.icalUrl}</div>
            {s.listing && <div className="text-sm text-gray-600">Linked to listing: {s.listing.title}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}


