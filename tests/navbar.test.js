/**
 * @jest-environment jsdom
 */

describe('Navbar UI Logic', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = class IntersectionObserver {
      constructor() {}
      observe() { return null; }
      unobserve() { return null; }
      disconnect() { return null; }
    };

    document.body.innerHTML = `
      <nav class="nav" id="navbar">
        <div class="nav-container"></div>
      </nav>
    `;
    // Mock scroll event
    require('../js/main.js');
  });

  test('navbar should have glassmorphism classes', () => {
    const navbar = document.getElementById('navbar');
    expect(navbar).toBeTruthy();
    expect(navbar.classList.contains('nav')).toBe(true);
  });

  test('navbar should change style on scroll', () => {
    const navbar = document.getElementById('navbar');
    
    // Initial state
    expect(navbar.classList.contains('scrolled')).toBe(false);

    // Simulate scroll down
    Object.defineProperty(window, 'pageYOffset', { value: 150, writable: true });
    window.dispatchEvent(new Event('scroll'));
    
    expect(navbar.classList.contains('scrolled')).toBe(true);

    // Simulate scroll up
    Object.defineProperty(window, 'pageYOffset', { value: 50, writable: true });
    window.dispatchEvent(new Event('scroll'));
    
    expect(navbar.classList.contains('scrolled')).toBe(false);
  });
});
