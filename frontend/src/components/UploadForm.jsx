import React, { useState } from "react";

export default function UploadForm({ onParsed }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setError(null);
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL ||
          "https://mass-mailer-backend.onrender.com"
        }/api/upload/parse`,
        {
          method: "POST",
          body: form,
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to parse CSV");
      } else {
        onParsed(data);
      }
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setError(null);
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-xl font-semibold">Upload Recipients CSV</h2>
          <p className="text-sm text-gray-500">
            Upload a file with an{" "}
            <code className="bg-gray-100 px-1 rounded">email</code> column.
          </p>
        </div>
        <div className="text-xs inline-flex items-center bg-indigo-100 text-indigo-800 font-medium px-2 py-1 rounded-full">
          Supported: .csv
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-4">
        <label
          htmlFor="csv-upload"
          className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg px-4 py-10 cursor-pointer hover:border-indigo-500 transition text-center"
        >
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
            disabled={loading}
          />
          <div className="pointer-events-none">
            {file ? (
              <div className="space-y-1">
                <div className="font-medium">{file.name}</div>
                <div className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>
            ) : (
              <div className="text-gray-600">
                Click or drag & drop your CSV file here
                <br />
                <span className="text-xs">
                  (must have an{" "}
                  <code className="bg-gray-100 px-1 rounded">email</code>{" "}
                  column)
                </span>
              </div>
            )}
          </div>
          {file && !loading && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                clearFile();
              }}
              className="absolute top-2 right-2 text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
            >
              Clear
            </button>
          )}
        </label>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded flex items-center gap-2">
            <div className="font-medium">Error:</div>
            <div>{error}</div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 items-start">
          <button
            type="submit"
            disabled={!file || loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition ${
              !file || loading
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
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
                <span>Parsing...</span>
              </>
            ) : (
              <span>Upload & Validate</span>
            )}
          </button>

          <div className="text-sm text-gray-600">
            Need a template?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const sample =
                  "email,first_name,last_name\nalice@example.com,Alice,Patel\nbob@example.org,Bob,Sharma\n";
                const blob = new Blob([sample], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "sample_recipients.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-indigo-600 underline"
            >
              Download sample CSV
            </a>
          </div>
        </div>

        {file && (
          <div className="text-xs text-gray-500">
            Only the <code className="bg-gray-100 px-1 rounded">email</code>{" "}
            column is required for the MVP; others can be used later for
            personalization.
          </div>
        )}
      </form>
    </div>
  );
}
