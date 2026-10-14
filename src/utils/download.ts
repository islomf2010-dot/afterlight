/**
 * Browser download + file-picking helpers.
 * All Blob/anchor work is guarded: Safari and older iOS reject some patterns.
 */

export const downloadBlob = (blob: Blob, filename: string): boolean => {
  try {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = 'noopener';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    // Revoke on the next macrotask so Firefox has time to start the transfer.
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  } catch {
    return false;
  }
};

export const downloadJson = (data: unknown, filename: string): boolean =>
  downloadBlob(
    new Blob([`${JSON.stringify(data, null, 2)}\n`], { type: 'application/json' }),
    filename,
  );

export const downloadText = (text: string, filename: string, mime = 'text/plain'): boolean =>
  downloadBlob(new Blob([text], { type: `${mime};charset=utf-8` }), filename);

/**
 * Opens the OS file picker and resolves with the file's text, or `null` if the
 * visitor cancelled.
 *
 * Cancelling is the hard part. Chrome and Edge fire a `cancel` event on the
 * input; Safari and Firefox do not, so a naive implementation leaves the caller
 * awaiting forever — which would silently strand the IMPORT button. The window
 * regaining focus is the reliable cross-browser signal that the dialog closed
 * without a selection, so it is used as the fallback, with the `cancel` event
 * only racing it to resolve sooner.
 */
export const pickTextFile = (accept = 'application/json,.json'): Promise<string | null> =>
  new Promise((resolve) => {
    let input: HTMLInputElement | null = null;
    try {
      input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.style.display = 'none';

      let settled = false;
      const finish = (value: string | null): void => {
        if (settled) return;
        settled = true;
        window.removeEventListener('focus', onFocus);
        clearTimeout(guard);
        input?.remove();
        resolve(value);
      };

      const onFocus = (): void => {
        // The window regains focus when the dialog closes. Give the `change`
        // event one turn of the event loop to arrive first.
        window.setTimeout(() => finish(null), 350);
      };

      input.addEventListener('change', () => {
        const file = input?.files?.[0];
        if (!file) return finish(null);
        file
          .text()
          .then((text) => finish(text))
          .catch(() => finish(null));
      });
      input.addEventListener('cancel', () => finish(null));

      document.body.appendChild(input);
      input.click();

      // Absolute backstop: never leave a pending promise, whatever the browser
      // does or does not fire.
      const guard = window.setTimeout(() => finish(null), 120_000);
      window.addEventListener('focus', onFocus, { once: true });
    } catch {
      input?.remove();
      resolve(null);
    }
  });
