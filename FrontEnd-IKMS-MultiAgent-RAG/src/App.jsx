import { useMemo, useState } from 'react';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
} from '@/components/ai-elements/prompt-input';
import { Loader } from '@/components/ai-elements/loader';
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('ready');

  const exampleSuggestions = useMemo(
    () => [
      {
        label: '2002 Net Income',
        text: 'What was the net income for XYZ Company in 2002?',
      },
      {
        label: 'Business Nature',
        text: 'What is the nature of the company’s business?',
      },
      {
        label: 'Debt Details',
        text: 'Provide details on the long-term debt.',
      },
    ],
    []
  );

  const sendQuestion = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setStatus('submitted');

    const assistantMessageId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        answer: '',
        plan: '',
        subQuestions: [],
        context: '',
      },
    ]);

    try {
      const response = await fetch('http://localhost:8585/qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: trimmed }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      if (!response.body) {
        throw new Error('Readable stream not available in response.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const updateAssistant = (updater) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? updater(msg) : msg
          )
        );
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine.startsWith('data:')) continue;

          const rawData = trimmedLine.slice(5).trim();

          if (rawData === '[DONE]') {
            continue;
          }

          try {
            const parsed = JSON.parse(rawData);

            if (parsed.type === 'text-delta') {
              updateAssistant((msg) => ({
                ...msg,
                content: (msg.content || '') + (parsed.delta || ''),
              }));
            }

            if (parsed.type === 'data-plan') {
              updateAssistant((msg) => ({
                ...msg,
                plan: parsed.data || '',
              }));
            }

            if (parsed.type === 'data-sub_questions') {
              updateAssistant((msg) => ({
                ...msg,
                subQuestions: Array.isArray(parsed.data) ? parsed.data : [],
              }));
            }

            if (parsed.type === 'data-context') {
              updateAssistant((msg) => ({
                ...msg,
                context: parsed.data || '',
              }));
            }

            if (parsed.type === 'data-answer') {
              updateAssistant((msg) => ({
                ...msg,
                answer: parsed.data || '',
                content: parsed.data || msg.content,
              }));
            }
          } catch (err) {
            console.error('Failed to parse stream line:', rawData, err);
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: 'Request failed. Check backend logs.',
                answer: 'Request failed. Check backend logs.',
              }
            : msg
        )
      );
    } finally {
      setStatus('ready');
    }
  };

  const handleSubmit = (value) => {
    const text = typeof value === 'string' ? value : value?.text || '';
    if (!text.trim()) return;
    sendQuestion(text);
    setInput('');
  };

  const handleSuggestionClick = (suggestion) => {
    if (!suggestion?.trim()) return;
    sendQuestion(suggestion);
  };

  return (
    <div className="mx-auto flex h-screen max-w-5xl flex-col p-6">
      <div className="mb-6 shrink-0">
        <div className="rounded-2xl border bg-card/70 p-5 shadow-sm backdrop-blur">
          <h1 className="text-2xl font-bold tracking-tight">IKMS Multi-Agent RAG</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Query Planning & Hallucination Verification Engine
          </p>
        </div>
      </div>

      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="space-y-4">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="w-full max-w-2xl rounded-3xl border bg-card/60 p-10 text-center shadow-sm">
                <h2 className="text-2xl font-semibold tracking-tight">
                  How can I assist your research?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  I can decompose your query, inspect retrieved evidence, and help verify factual outputs.
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              {message.role === 'user' ? (
                <Message from="user">
                  <MessageContent>
                    <div className="rounded-2xl border bg-primary/5 p-4 shadow-sm">
                      <MessageResponse>{message.content}</MessageResponse>
                    </div>
                  </MessageContent>
                </Message>
              ) : (
                <div className="rounded-2xl border bg-card p-4 shadow-sm space-y-4">
                  <div className="border-b pb-3">
                    <div className="text-sm font-semibold">Multi-Agent Analysis</div>
                    <div className="text-xs text-muted-foreground">
                      Structured response from planning and verification pipeline
                    </div>
                  </div>

                  {message.plan && (
                    <div className="rounded-xl border bg-muted/30 p-4">
                      <div className="mb-2 text-sm font-semibold">Plan</div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {message.plan}
                      </p>
                    </div>
                  )}

                  {message.subQuestions?.length > 0 && (
                    <div className="rounded-xl border bg-muted/30 p-4">
                      <div className="mb-2 text-sm font-semibold">Sub Questions</div>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        {message.subQuestions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(message.answer || message.content) && (
                    <div className="rounded-xl border bg-background p-4">
                      <div className="mb-2 text-sm font-semibold">Answer</div>
                      <div className="text-sm leading-7 whitespace-pre-wrap">
                        {message.answer || message.content}
                      </div>
                    </div>
                  )}

                  {message.context && (
                    <details className="rounded-xl border bg-muted/20 p-4">
                      <summary className="cursor-pointer text-sm font-semibold">
                        Retrieved Context
                      </summary>
                      <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap text-xs leading-6 text-muted-foreground">
                        {message.context}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          ))}

          {status === 'submitted' && (
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Loader />
                <div>
                  <div className="text-sm font-medium">Agents collaborating</div>
                  <div className="text-xs text-muted-foreground">
                    Planning query, retrieving evidence, and assembling response
                  </div>
                </div>
              </div>
            </div>
          )}
        </ConversationContent>

        <ConversationScrollButton />
      </Conversation>

      {messages.length === 0 && (
        <Suggestions className="mb-4 mt-4 flex flex-wrap gap-2">
          {exampleSuggestions.map((item) => (
            <Suggestion
              key={item.label}
              onClick={() => handleSuggestionClick(item.text)}
              suggestion={item.label}
              className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium transition hover:bg-muted"
            />
          ))}
        </Suggestions>
      )}

      <PromptInput onSubmit={handleSubmit} className="mt-4 shrink-0">
        <PromptInputBody className="rounded-2xl border bg-card shadow-sm">
          <PromptInputTextarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder="Ask a complex question..."
            className="min-h-[56px]"
          />
        </PromptInputBody>
        <PromptInputFooter className="mt-2">
          <div className="flex w-full items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground">
              Supports complex research and verification queries
            </div>
            <PromptInputSubmit disabled={!input.trim()} status={status} />
          </div>
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}

export default App;