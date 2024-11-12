import { z } from "zod";

export const getLocationSchema = z.object({});

export const getLocation = async () => {
  const response = await fetch("https://ipapi.co/json/");

  const locationData = await response.json();

  //   return { latitude: 43.6585, longitude: 79.3576 };
  return locationData;
};
