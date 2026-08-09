import React, { useMemo } from "react";
import { useState } from "react";
import EmailForm from "./components/EmailForm";
import UploadForm from "./components/UploadForm";
import ResultsTable from "./components/ResultsTable";
import "./App.css";

export default function App() {
  const [parsed, setParsed] = useState({ valid: [], invalid: [] });
  const [sendResult, setSendResult] = useState(null);

  const validCount = parsed.valid?.length || 0;
  const invalidCount = parsed.invalid?.length || 0;

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

  const resetAll = () => {
    setParsed({ valid: [], invalid: [] });
    setSendResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mass Mailer Dispatcher</h1>
            <p className="text-sm text-gray-600 mt-1">
              Upload, validate and broadcast emails with a single flow.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Valid: <span className="ml-1">{validCount}</span>
            </div>
            <div className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              Invalid: <span className="ml-1">{invalidCount}</span>
            </div>
            {sendResult && (
              <>
                <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Sent: <span className="ml-1">{sentCount}</span>
                </div>
                <div className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  Failed: <span className="ml-1">{failedCount}</span>
                </div>
              </>
            )}
            <button
              onClick={resetAll}
              className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full flex items-center gap-1"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Main forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="col-span-1">
            <UploadForm
              onParsed={(d) => {
                setParsed(d);
                setSendResult(null);
              }}
            />
          </div>
          <div className="col-span-1">
            <EmailForm
              validRecipients={parsed.valid || []}
              onResult={(r) => setSendResult(r)}
            />
          </div>
        </div>

        {/* Results */}
        <ResultsTable
          valid={parsed.valid || []}
          invalid={parsed.invalid || []}
          sendResult={sendResult}
        />

        {/* Footer / attribution */}
        <div className="text-center text-xs text-gray-500 mt-8">
          <div>Built for Exposys Data Labs Virtual Internship</div>
          <div className="mt-1">
            Demo flow: upload CSV → validate → compose → send → review summary.
          </div>
        </div>
      </div>
    </div>
  );
}
