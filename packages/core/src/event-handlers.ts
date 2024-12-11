export const EventHandlers = {
  handleError(e: Event): void {
    console.log('handleError:', e);
  },
  handleUnHandledRejection(e: PromiseRejectionEvent): void {
    console.log('handleUnHandledRejection:', e);
  },
  handleClick(e: MouseEvent): void {
    console.log('handleClick:', e);
  },
  handleKeyDown(e: KeyboardEvent): void {
    console.log('handleKeyDown:', e);
  },
  handleKeyUp(e: KeyboardEvent): void {
    console.log('handleKeyUp:', e);
  },
};
