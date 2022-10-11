import { writable } from 'svelte/store';

/**
 * @param defaults {Object}
 */
function createConfig(defaults) {
  const { subscribe, set } = writable(defaults);

  return {
    subscribe,
    set,
    reset: () => set({
        /** @type {""|"gotthelf"} */
        author: import.meta.env.VITE_AUTHOR ?? '',
        input: '',
        temp: 0.6,
        intro: true
    }),
    return: () => set({
        /** @type {""|"gotthelf"} */
        author: import.meta.env.VITE_AUTHOR ?? '',
        input: '',
        temp: 0.6,
        intro: false
    }),
  }
}

/**
 * @param value {number}
 */
export const config = createConfig({
	/** @type {""|"gotthelf"} */
	author: import.meta.env.VITE_AUTHOR ?? 'gotthelf',
	input: '',
	temp: 0.6,
  intro: false
});
