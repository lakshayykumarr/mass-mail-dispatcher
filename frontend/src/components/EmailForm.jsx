import React, { useState, useMemo } from "react";

export default function EmailForm({
  validRecipients = [],
  onResult,
  initialSubject = "Hello from Mass Mailer",
  initialMessage = "This is a test bulk email.",
}) {
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState(initialMessage);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [successSummary, setSuccessSummary] = useState(null);

  const recipientCount = validRecipients.length;
  const backendBase =
    import.meta.env.VITE_BACKEND_URL ||
    "https://mass-mailer-backend.onrender.com";

  const disabled = sending || recipientCount === 0;

  const send = async () => {
    if (recipientCount === 0) return;
    setError(null);
    setSuccessSummary(null);
    setSending(true);
    try {
      const res = await fetch(`${backendBase}/api/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          recipients: validRecipients,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessSummary(data);
        onResult && onResult(data);
      } else {
        setError(data.error || "Failed to send");
        onResult && onResult(data);
      }
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      setSending(false);
    }
  };

  const sentCount = useMemo(
    () =>
      successSummary?.result
        ? successSummary.result.filter((r) => r.status === "sent").length
        : 0,
    [successSummary]
  );
  const failedCount = useMemo(
    () =>
      successSummary?.result
        ? successSummary.result.filter((r) => r.status !== "sent").length
        : 0,
    [successSummary]
  );

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mt-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Compose & Send</h2>
          <p className="text-sm text-gray-500">
            Ready to email your valid recipients
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
            <span className="mr-1">Valid:</span>
            <span className="font-semibold">{recipientCount}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex flex-col">
          <label htmlFor="subject" className="text-sm font-medium mb-1">
            Subject
          </label>
          <div className="relative">
            <input
              id="subject"
              type="text"
              maxLength={100}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={sending}
            />
            <div className="absolute right-2 top-2 text-xs text-gray-400">
              {subject.trim().length}/100
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="message" className="text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            className="w-full border rounded-md px-4 py-2 h-36 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={sending}
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {message.trim().length} characters
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={send}
            disabled={disabled}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition ${
              disabled
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {sending && (
              <svg
                className="w-5 h-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            <span>
              {sending
                ? "Sending..."
                : `Send to ${recipientCount} ${
                    recipientCount === 1 ? "email" : "emails"
                  }`}
            </span>
          </button>
          {recipientCount === 0 && (
            <div className="text-sm text-red-600">
              Need at least one valid recipient
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            <div className="font-medium">Error:</div>
            <div>{error}</div>
          </div>
        )}

        {successSummary && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
            <div className="flex flex-col sm:flex-row justify-between">
              <div className="font-medium mb-1 sm:mb-0">Send Summary</div>
              <div className="flex gap-4 text-sm">
                <div>
                  ✅ Sent: <span className="font-semibold">{sentCount}</span>
                </div>
                <div>
                  ❌ Failed:{" "}
                  <span className="font-semibold">{failedCount}</span>
                </div>
              </div>
            </div>
            {failedCount > 0 && (
              <div className="mt-2 text-xs">
                Check the detailed results below or retry failed addresses.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
