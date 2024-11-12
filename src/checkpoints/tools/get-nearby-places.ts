import { z } from "zod";

export const getNearbyPlacesSchema = z.object({
  latitude: z.string().describe("Latitude of location"),
  longitude: z.string().describe("Longitude of location"),
  radius: z
    .number()
    .describe("Radius of interest from latitude and longitude")
    .optional()
    .default(5),
  query: z.string().describe("Search query"),
});

type GetNearbyPlacesProps = z.infer<typeof getNearbyPlacesSchema>;

export const getNearbyPlaces = async ({
  latitude,
  longitude,
  query,
  radius = 5,
}: GetNearbyPlacesProps) => {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  // Calculate offsets from radius
  const latOffset = radius / 111.11; // approximately 0.045 degrees
  const lonOffset = radius / (111.11 * Math.cos(lat * (Math.PI / 180))); // convert lat to radians for cos

  // Calculate viewbox coordinates
  const viewbox = {
    left: lon - lonOffset,
    top: lat + latOffset,
    right: lon + lonOffset,
    bottom: lat - latOffset,
  };

  // Construct URL with viewbox
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&viewbox=${viewbox.left},${viewbox.top},${viewbox.right},${viewbox.bottom}&bounded=1`;

  const response = await fetch(url);

  const data = await response.json();

  return data;
};
