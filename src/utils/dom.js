/**
 * DOM Utility Helpers
 */

/**
 * Query a single element from document or parent
 * @param {string} selector
 * @param {ParentNode} [parent=document]
 * @returns {Element|null}
 */
export const $ = (selector, parent = document) => parent.querySelector(selector);

/**
 * Query all elements matching selector as an Array
 * @param {string} selector
 * @param {ParentNode} [parent=document]
 * @returns {Element[]}
 */
export const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

/**
 * Event listener helper with safety check
 * @param {EventTarget} target
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean|AddEventListenerOptions} [options]
 */
export const on = (target, event, handler, options) => {
  if (target) {
    target.addEventListener(event, handler, options);
  }
};
