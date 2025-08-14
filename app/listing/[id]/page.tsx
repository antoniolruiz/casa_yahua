import { getListingDetail } from "@/lib/data";
import Image from "next/image";
import BookingForm from "@/components/BookingForm";
import { prisma } from "@/lib/prisma";

export default async function ListingPage({ params }: { params: { id: string } }) {
  const listing = await getListingDetail(params.id);

  if (!listing) {
    return <div>Listing not found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {listing.images.length > 0 ? (
            listing.images.map((img) => (
              <div key={img.id} className="relative h-64 w-full">
                <Image src={img.url} alt={listing.title} fill className="object-cover rounded" />
              </div>
            ))
          ) : (
            <div className="rounded bg-gray-100 p-6 text-gray-500">Images coming soon</div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{listing.title}</h1>
          <p className="text-gray-600">{listing.hotel.location}</p>
          {/* Refresh images disabled in static export */}
        </div>
      </div>
      <div>
        <BookingForm listingId={listing.id} basePriceCents={listing.nightlyBasePrice} currency={listing.baseCurrency} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const rows = await prisma.listing.findMany({ select: { id: true } });
  return rows.map((r) => ({ id: r.id }));
}


