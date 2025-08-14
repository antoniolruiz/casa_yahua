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


