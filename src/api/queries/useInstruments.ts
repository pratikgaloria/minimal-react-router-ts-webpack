import { useQuery } from "@tanstack/react-query";
import { TInstrument } from "../models/instruments";

export default function () {
  return useQuery<TInstrument, Error>({
    queryKey: ["instruments"],
    queryFn: () => fetch("/api/instruments").then((response) => response.json()),
  });
}
