// import { IErrorLog } from "@web-guard/types";
// import { errorReporter } from "./repoter";

export const EventHandlers = {
  handleError(e: Event): void {
    // errorReporter.send(log);
    console.log('handleError:', e);
  },
  handleUnHandledRejection(e: PromiseRejectionEvent): void {
    // errorReporter.send(log);
    console.log('handleUnHandledRejection:', e);
  },
};
