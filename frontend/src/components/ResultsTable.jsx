import React, { useMemo } from "react";

export default function ResultsTable({
  valid = [],
  invalid = [],
  sendResult = null,
}) {
  const validCount = valid.length;
  const invalidCount = invalid.length;

  const sentCount = useMemo(
    () =>
      sendResult?.result
        ? sendResult.result.filter((r) => r.status === "sent").length
        : 0,
    [sendResult]
  );
  const failedCount = useMemo(
    () =>
      sendResult?.result
        ? sendResult.result.filter((r) => r.status !== "sent").length
        : 0,
    [sendResult]
  );

  const copyList = (list) => {
    navigator.clipboard.writeText(list.join("\n"));
  };

  return (
    <div className="space-y-6 mt-6 max-w-3xl mx-auto">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold">Valid Emails</h3>
              <p className="text-xs text-gray-500">Ready to be emailed</p>
            </div>
            <div className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
              {validCount}
            </div>
          </div>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => copyList(valid)}
              disabled={validCount === 0}
              className="text-xs inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Copy All
            </button>
          </div>
          <div className="text-sm max-h-44 overflow-auto space-y-1">
            {validCount === 0 ? (
              <div className="text-gray-400 italic">No valid emails yet.</div>
            ) : (
              valid.map((e) => (
                <div
                  key={e}
                  className="flex justify-between bg-green-50 px-3 py-1 rounded"
                >
                  <span className="truncate">{e}</span>
                  <span className="text-green-700 text-xs font-medium">✔</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="relative bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold">Invalid Emails</h3>
              <p className="text-xs text-gray-500">Will be skipped</p>
            </div>
            <div className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded-full">
              {invalidCount}
            </div>
          </div>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => copyList(invalid)}
              disabled={invalidCount === 0}
              className="text-xs inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Copy All
            </button>
          </div>
          <div className="text-sm max-h-44 overflow-auto space-y-1">
            {invalidCount === 0 ? (
              <div className="text-gray-400 italic">No invalid emails.</div>
            ) : (
              invalid.map((e) => (
                <div
                  key={e}
                  className="flex justify-between bg-red-50 px-3 py-1 rounded"
                >
                  <span className="truncate">{e}</span>
                  <span className="text-red-600 text-xs font-medium">✕</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {sendResult && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
            <div>
              <h3 className="text-lg font-semibold">Send Results</h3>
              <p className="text-sm text-gray-500">
                Summary of what was delivered
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="inline-flex items-center gap-1">
                <span className="text-green-600 font-semibold">✅ Sent:</span>{" "}
                <span>{sentCount}</span>
              </div>
              <div className="inline-flex items-center gap-1">
                <span className="text-red-600 font-semibold">❌ Failed:</span>{" "}
                <span>{failedCount}</span>
              </div>
            </div>
          </div>
          <div className="max-h-60 overflow-auto text-sm space-y-1">
            {sendResult.result.map((r) => (
              <div
                key={r.to}
                className="flex justify-between items-center p-2 rounded border"
              >
                <div className="flex flex-col">
                  <span className="font-medium truncate">{r.to}</span>
                  {r.status !== "sent" && (
                    <span className="text-xs text-red-600">
                      {r.error || "unknown error"}
                    </span>
                  )}
                </div>
                <div>
                  {r.status === "sent" ? (
                    <div className="text-green-600 font-semibold">Sent</div>
                  ) : (
                    <div className="text-red-600 font-semibold">Error</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
