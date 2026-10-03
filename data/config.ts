// Everything you'll want to change lives in this file.

export const config = {
  // Used to format dates, e.g. "Saturday, October 17".
  locale: "en-US",
};

export type Restaurant = {
  id: string;
  name: string;
  description: string; // keep to 1–2 lines
  image: string; // path in /public, e.g. "/restaurants/sapore.jpg"
  location: string;
  tiktokUrl: string;
  mapsUrl: string;
  menu: string[]; // 2–4 highlights
};

// Images are placeholders: drop real photos into /public/restaurants.
export const restaurants: Restaurant[] = [
  {
    id: "sapore",
    name: "Sapore",
    description: "Italian, known for its lasagna (about ten kinds), handmade pasta, and thin pizza.",
    image: "/restaurants/sapore.svg",
    location: "Zimbabwe St, Bole Japan",
    tiktokUrl: "https://www.tiktok.com/@halalreviewet/video/7552867918657178892",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sapore+Restaurant+Zimbabwe+St+Addis+Ababa",
    menu: [
      "Sapore Lasagna",
      "Lasagna Verde",
      "Pasta ragù",
      "Quattro Stagioni pizza",
    ],
  },
  {
    id: "chanoly",
    name: "Chanoly Noodles",
    description: "Casual stir-fried noodles, big salads, and smoothies, with fasting options.",
    image: "/restaurants/chanoly.svg",
    location: "Bole Medhanialem",
    tiktokUrl: "https://www.tiktok.com/@chanoly_noodles_official",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=XQWR%2BCPX+Addis+Ababa",
    menu: [
      "Vegetable noodles",
      "Chicken noodles",
      "House salad",
      "Smoothies",
    ],
  },
  {
    id: "simple-bistro",
    name: "Simple Bistro",
    description: "Burgers since 2016. Relaxed, with acoustic nights on some Fridays.",
    image: "/restaurants/simple-bistro.svg",
    location: "Bole Medhanialem, Abrham's Building",
    tiktokUrl: "https://www.tiktok.com/@simplebistroaddis",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=XQVR%2BG8+Addis+Ababa",
    menu: [
      "Chicken Junkie",
      "Double Chili Burger",
      "BBQ chicken wings",
      "Chili cheese fries",
    ],
  },
];
