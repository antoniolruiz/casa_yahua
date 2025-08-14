import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hotel = await prisma.hotel.create({
    data: {
      name: "Casa Yahua",
      description: "Boutique stays managed centrally. Multiple listings per hotel.",
      location: "Mexico City, MX",
      listings: {
        create: [
          {
            airbnbId: "46495863",
            airbnbUrl: "https://www.airbnb.com/rooms/46495863",
            icalUrl:
              "https://www.airbnb.com/calendar/ical/46495863.ics?s=02b8b1c66d4cc69dac28803acff4efda",
            title: "Casa Yahua Listing A",
            nightlyBasePrice: 10000,
          },
        ],
      },
    }
  });

  const listing = await prisma.listing.findFirst({
    where: { hotelId: hotel.id },
  });

  if (listing?.icalUrl) {
    await prisma.calendarSource.upsert({
      where: { icalUrl: listing.icalUrl },
      update: {
        listingId: listing.id,
      },
      create: {
        name: `Airbnb iCal for ${listing.title}`,
        icalUrl: listing.icalUrl,
        listingId: listing.id,
      },
    });
  }

  // Demo Hotel with two sample listings and images (idempotent by name)
  const demoExists = await prisma.hotel.findFirst({ where: { name: "Demo Hotel" } });
  if (!demoExists) {
    await prisma.hotel.create({
      data: {
        name: "Demo Hotel",
        description: "A demo property with two sample listings for testing.",
        location: "Anywhere, Earth",
        listings: {
          create: [
            {
              airbnbId: "demo-listing-1",
              airbnbUrl: "https://example.com/demo-listing-1",
              title: "Ocean View Suite",
              nightlyBasePrice: 18000,
              baseCurrency: "USD",
              images: {
                create: [
                  { url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop", position: 0 },
                  { url: "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d95?q=80&w=1600&auto=format&fit=crop", position: 1 },
                  { url: "https://images.unsplash.com/photo-1505691938893-1f2e1b5aa0eb?q=80&w=1600&auto=format&fit=crop", position: 2 },
                ],
              },
            },
            {
              airbnbId: "demo-listing-2",
              airbnbUrl: "https://example.com/demo-listing-2",
              title: "Garden Studio",
              nightlyBasePrice: 9500,
              baseCurrency: "USD",
              images: {
                create: [
                  { url: "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d95?q=80&w=1600&auto=format&fit=crop", position: 0 },
                  { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop", position: 1 },
                  { url: "https://images.unsplash.com/photo-1505691728513-36a5ac3b2d95?q=80&w=1600&auto=format&fit=crop", position: 2 },
                ],
              },
            },
          ],
        },
      },
    });
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


