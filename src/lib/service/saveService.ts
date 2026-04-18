import { noteService } from "$lib/service/noteService";

const ms = 500;
let timeoutID: ReturnType<typeof setTimeout> | null = null;

const saveService = {
  clearTimer() {
    if (timeoutID) {
      clearTimeout(timeoutID);
      timeoutID = null;
    }
  },

  startTimer() {
    if (timeoutID) return;

    timeoutID = setTimeout(() => {
      noteService.saveNote();
    }, ms);
  },

  resetTimer() {
    this.clearTimer();
    this.startTimer();
  },
};

export { saveService };
