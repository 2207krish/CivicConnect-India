function unsplash(id: string, width = 1600) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const civicImages = {
  hero: unsplash("photo-1587474260584-13657470ed2c"),
  gateway: unsplash("photo-1524492412937-b28074a5d7da"),
  jaipur: unsplash("photo-1477587458883-47145ed94245"),
  mumbai: unsplash("photo-1570168007204-dfb528c6958f"),
  traffic: unsplash("photo-1532664189809-02133fee698d"),
  night: unsplash("photo-1519501025264-65ba15a82390"),
  water: unsplash("photo-1548839140-29a749e1cf4d"),
  park: unsplash("photo-1585938389612-a552a28d6914"),
  road: unsplash("photo-1465447142348-e9952c393450"),
  power: unsplash("photo-1473341304170-971dccb5ac1e"),
  city: unsplash("photo-1449824913935-59a10b8d2000"),
};

export const categoryImages: Record<string, string> = {
  roads: civicImages.road,
  electricity: civicImages.power,
  sanitation: civicImages.mumbai,
  water: civicImages.water,
  garbage: civicImages.city,
  street_lights: civicImages.night,
  parks: civicImages.park,
  stray_animals: civicImages.park,
  traffic: civicImages.traffic,
  public_property: civicImages.hero,
};
