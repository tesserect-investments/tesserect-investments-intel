import { isDesktopRuntime } from '@/services/runtime';
import { t } from '@/services/i18n';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const DISMISSED_KEY = 'tesserect-ai-widget-dismissed';

interface ChatState {
  messages: ChatMessage[];
  sending: boolean;
}

const INITIAL_SYSTEM_CONTEXT =
  'You are Tesserect AI, an assistant embedded in the Tesserect trade intelligence dashboard. ' +
  'Tesserect focuses on commodity trade facilitation, trade corridors, ports, Gulf investments, ' +
  'and economic intelligence with a strong emphasis on South Africa, Africa, MENA, and Asia. ' +
  'Align answers with Tesserect’s goals: helping exporters, investors, and policy teams understand ' +
  'trade flows, risks, and opportunities. Prefer discussion of international trade, supply chains, ' +
  'ports, trade policy, and investment corridors over purely military topics.';

export function mountAiChatWidget(): void {
  if (document.querySelector('.tesserect-ai-widget')) return;
  if (localStorage.getItem(DISMISSED_KEY) === 'true') return;

  const root = document.createElement('div');
  root.className = 'community-widget tesserect-ai-widget';

  // Inject minimal styles for the chat panel without touching main.css
  injectStylesOnce();

  root.innerHTML = `
    <div class="cw-pill cw-ai-pill">
      <div class="cw-dot"></div>
      <span class="cw-text">Tesserect AI</span>
      <button class="cw-cta" type="button">${t('common.open') || 'Open'}</button>
      <button class="cw-close" aria-label="${t('common.close')}">&times;</button>
    </div>
    <div class="cw-chat-panel cw-chat-hidden">
      <div class="cw-chat-header">
        <span class="cw-chat-title">Tesserect AI</span>
        ${isDesktopRuntime()
          ? '<label class="cw-chat-confidential"><input type="checkbox" class="cw-chat-conf-toggle" /> Confidential (local only)</label>'
          : '<span class="cw-chat-confidential-hint">Cloud AI — avoid sensitive data</span>'}
      </div>
      <div class="cw-chat-body"></div>
      <form class="cw-chat-input-row">
        <textarea class="cw-chat-input" rows="2" placeholder="Ask about trade, ports, corridors, or markets..."></textarea>
        <button type="submit" class="cw-chat-send">${t('common.send') || 'Send'}</button>
      </form>
      ${
        isDesktopRuntime()
          ? '<div class="cw-chat-footer"><button type="button" class="cw-chat-upload-btn">Upload docs (desktop only)</button></div>'
          : ''
      }
    </div>
  `;

  const pill = root.querySelector('.cw-pill') as HTMLDivElement | null;
  const closeBtn = root.querySelector('.cw-close') as HTMLButtonElement | null;
  const ctaBtn = root.querySelector('.cw-cta') as HTMLButtonElement | null;
  const panel = root.querySelector('.cw-chat-panel') as HTMLDivElement | null;
  const body = root.querySelector('.cw-chat-body') as HTMLDivElement | null;
  const form = root.querySelector('.cw-chat-input-row') as HTMLFormElement | null;
  const input = root.querySelector('.cw-chat-input') as HTMLTextAreaElement | null;
  const confToggle = root.querySelector('.cw-chat-conf-toggle') as HTMLInputElement | null;
  const uploadBtn = root.querySelector('.cw-chat-upload-btn') as HTMLButtonElement | null;

  const state: ChatState = {
    messages: [],
    sending: false,
  };

  const renderMessages = () => {
    if (!body) return;
    body.innerHTML = state.messages
      .map((m) => {
        const cls = m.role === 'user' ? 'cw-chat-msg-user' : 'cw-chat-msg-assistant';
        const label = m.role === 'user' ? 'You' : 'Tesserect AI';
        return `
          <div class="cw-chat-msg ${cls}">
            <div class="cw-chat-msg-label">${label}</div>
            <div class="cw-chat-msg-content">${escapeHtml(m.content)}</div>
          </div>
        `;
      })
      .join('');
    body.scrollTop = body.scrollHeight;
  };

  const togglePanel = () => {
    if (!panel) return;
    const hidden = panel.classList.contains('cw-chat-hidden');
    if (hidden) {
      panel.classList.remove('cw-chat-hidden');
      input?.focus();
      if (state.messages.length === 0) {
        state.messages.push({
          role: 'assistant',
          content:
            'Hi, I am Tesserect AI. I can help you reason about trade corridors, ports, Gulf investments, and economic intelligence. What would you like to explore?',
        });
        renderMessages();
      }
    } else {
      panel.classList.add('cw-chat-hidden');
    }
  };

  const dismiss = () => {
    root.classList.add('cw-hiding');
    setTimeout(() => root.remove(), 300);
  };

  pill?.addEventListener('click', (evt) => {
    const target = evt.target as HTMLElement;
    if (target === closeBtn) return;
    if (target === ctaBtn) {
      evt.stopPropagation();
      togglePanel();
      return;
    }
    togglePanel();
  });

  closeBtn?.addEventListener('click', (evt) => {
    evt.stopPropagation();
    dismiss();
  });

  form?.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    if (!input || !input.value.trim() || state.sending) return;
    const text = input.value.trim();
    input.value = '';
    state.messages.push({ role: 'user', content: text });
    renderMessages();
    state.sending = true;
    try {
      const confidential = !!confToggle?.checked && isDesktopRuntime();
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: state.messages,
          confidential,
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as { reply?: string; error?: string };
      if (data.reply) {
        state.messages.push({ role: 'assistant', content: data.reply });
      } else if (data.error) {
        state.messages.push({ role: 'assistant', content: `Error: ${data.error}` });
      }
    } catch (err) {
      state.messages.push({
        role: 'assistant',
        content: 'Tesserect AI is unavailable right now. Please try again later.',
      });
    } finally {
      state.sending = false;
      renderMessages();
    }
  });

  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      // Placeholder for desktop-only doc upload wiring via Tauri/sidecar.
      state.messages.push({
        role: 'assistant',
        content:
          'Document upload is available in the desktop app. In this build, files are not yet wired into Tesserect AI.',
      });
      renderMessages();
    });
  }

  document.body.appendChild(root);
}

function injectStylesOnce(): void {
  if (document.getElementById('tesserect-ai-chat-styles')) return;
  const style = document.createElement('style');
  style.id = 'tesserect-ai-chat-styles';
  style.textContent = `
    .tesserect-ai-widget .cw-ai-pill {
      cursor: pointer;
    }
    .cw-chat-panel {
      position: fixed;
      right: 16px;
      bottom: 72px;
      width: 320px;
      max-height: 420px;
      background: var(--bg-elevated, #111827);
      color: var(--fg-default, #e5e7eb);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 1000;
    }
    .cw-chat-hidden {
      display: none;
    }
    .cw-chat-header {
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      font-size: 12px;
    }
    .cw-chat-title {
      font-weight: 600;
    }
    .cw-chat-confidential,
    .cw-chat-confidential-hint {
      font-size: 11px;
      opacity: 0.8;
    }
    .cw-chat-body {
      padding: 8px 10px;
      overflow-y: auto;
      flex: 1;
      font-size: 12px;
    }
    .cw-chat-input-row {
      display: flex;
      flex-direction: column;
      border-top: 1px solid rgba(255,255,255,0.06);
      padding: 6px;
      gap: 4px;
    }
    .cw-chat-input {
      resize: none;
      background: rgba(15,23,42,0.9);
      color: inherit;
      border-radius: 6px;
      border: 1px solid rgba(148,163,184,0.5);
      padding: 4px 6px;
      font-size: 12px;
    }
    .cw-chat-send {
      align-self: flex-end;
      padding: 4px 10px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 12px;
    }
    .cw-chat-footer {
      padding: 4px 8px 6px;
      border-top: 1px solid rgba(255,255,255,0.06);
      text-align: right;
    }
    .cw-chat-upload-btn {
      font-size: 11px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      padding: 2px 8px;
    }
    .cw-chat-msg {
      margin-bottom: 6px;
    }
    .cw-chat-msg-label {
      font-size: 10px;
      opacity: 0.7;
      margin-bottom: 2px;
    }
    .cw-chat-msg-content {
      white-space: pre-wrap;
      word-wrap: break-word;
      border-radius: 6px;
      padding: 4px 6px;
      background: rgba(15,23,42,0.8);
    }
    .cw-chat-msg-user .cw-chat-msg-content {
      background: rgba(37,99,235,0.8);
    }
  `;
  document.head.appendChild(style);
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

