"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userContent = input.trim();
    setInput("");
    const userMessage = { role: "user", content: userContent };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const nextMessages = [...messages, userMessage];
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data.error ?? res.statusText}` },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content ?? "" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${err.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-900 text-zinc-100">
      <header className="border-b border-zinc-700 px-4 py-3">
        <h1 className="text-lg font-semibold">Nigel</h1>
        <p className="text-sm text-zinc-400">Your AI style coach</p>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="text-center text-zinc-500 text-sm">
            Say hello and ask me anything about style.
          </p>
        )}
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={
                msg.role === "user"
                  ? "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-zinc-700 px-4 py-2.5"
                  : "mr-auto max-w-[85%] rounded-2xl rounded-bl-md bg-zinc-800 px-4 py-2.5"
              }
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="mr-auto max-w-[85%] rounded-2xl rounded-bl-md bg-zinc-800 px-4 py-2.5">
              <p className="text-sm text-zinc-400">Thinking...</p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-zinc-700 p-4">
        <div className="mx-auto flex max-w-2xl gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
            placeholder="Message Nigel..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-zinc-600 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="rounded-xl bg-zinc-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
