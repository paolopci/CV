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
        <div id="ai-chat-messages">
          <div id="ai-suggestions" class="ai-suggestions">
            <button type="button" class="ai-suggestion-chip" data-question="Che esperienza ha Paolo?">Che esperienza ha Paolo?</button>
          </div>
        </div>
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

  test('sends FAQ chip as user message and appends assistant response', () => {
    const chip = document.querySelector('.ai-suggestion-chip');
    const input = document.getElementById('ai-user-input');
    const live = document.getElementById('a11y-status');

    chip.click();
    let messages = document.querySelectorAll('.ai-message');

    expect(messages).toHaveLength(1);
    expect(messages[0].classList.contains('user')).toBe(true);
    expect(messages[0].textContent).toBe('Che esperienza ha Paolo?');
    expect(document.activeElement).toBe(input);

    jest.advanceTimersByTime(600);
    messages = document.querySelectorAll('.ai-message');

    expect(messages).toHaveLength(2);
    expect(messages[1].classList.contains('assistant')).toBe(true);
    expect(messages[1].textContent).toContain('TIM, Aruba, BKN301');
    expect(messages[1].textContent).toContain('PHP ad ASP.NET Core');

    jest.advanceTimersByTime(50);
    expect(live.textContent).toBe('Risposta dell\'assistente AI aggiunta');
  });
});
