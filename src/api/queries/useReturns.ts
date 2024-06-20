import { useQuery } from "@tanstack/react-query";
import { TReturns } from "../models/returns";

export default function () {
  return useQuery<TReturns, Error>({
    queryKey: ["returns"],
    queryFn: () => fetch("/api/returns").then((response) => response.json()),
  });
}
