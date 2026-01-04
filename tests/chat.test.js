/**
 * @jest-environment jsdom
 */

describe('AI Chat Accessibility', () => {
  beforeEach(() => {
    jest.useFakeTimers();

    global.IntersectionObserver = class IntersectionObserver {
      constructor() {}
      observe() { return null; }
      unobserve() { return null; }
      disconnect() { return null; }
    };

    document.body.innerHTML = `
      <div id="a11y-status"></div>
      <div id="ai-assistant-container">
        <div id="ai-chat-window" class="ai-chat-window" style="display:none;" aria-hidden="true"></div>
        <button id="ai-fab" aria-expanded="false"></button>
        <button id="close-chat"></button>
        <input id="ai-user-input" />
        <button id="ai-send-btn"></button>
        <div id="ai-chat-messages"></div>
      </div>
    `;

    jest.resetModules();
    require('../js/main.js');

    if (typeof window.initAIChat === 'function') {
      window.initAIChat();
    }
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('toggles aria attributes and focuses input on open', () => {
    const fab = document.getElementById('ai-fab');
    const chatWindow = document.getElementById('ai-chat-window');
    const input = document.getElementById('ai-user-input');

    expect(chatWindow.getAttribute('aria-hidden')).toBe('true');
    expect(fab.getAttribute('aria-expanded')).toBe('false');

    fab.click();
    jest.runAllTimers();

    expect(chatWindow.style.display).toBe('flex');
    expect(chatWindow.getAttribute('aria-hidden')).toBe('false');
    expect(fab.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(input);
  });

  test('returns focus to fab when chat closes', () => {
    const fab = document.getElementById('ai-fab');
    const closeBtn = document.getElementById('close-chat');

    fab.focus();
    fab.click();
    jest.runAllTimers();

    closeBtn.click();
    jest.runAllTimers();

    expect(document.activeElement).toBe(fab);
  });
});
