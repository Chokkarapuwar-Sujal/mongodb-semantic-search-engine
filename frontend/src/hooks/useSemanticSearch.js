import { useMutation } from "@tanstack/react-query";
import { searchDocuments } from "../services/api";

export function useSemanticSearch() {
  return useMutation({
    mutationFn: searchDocuments,
  });
}
