import { queryOptions } from "@tanstack/react-query";
import { listTires } from "./tires.functions";

export const tiresQuery = queryOptions({
  queryKey: ["tires"],
  queryFn: () => listTires(),
});
