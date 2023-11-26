"use client";

import { FormEventHandler, useRef, useState } from "react";

interface IResult {
  A: number;
  B: number;
  C: number;
  result: [number, number][];
}

export default function FileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<IResult[]>([]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!fileInputRef.current?.files) {
      alert("Please choose a file to upload");
      return;
    }

    const formData = new FormData();
    const file = fileInputRef.current.files[0];
    formData.append("file", file);

    const response = await fetch("/api/processFile", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    setResult(result.data as IResult[]);
  };

  return (
    <div className="p-6 w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded shadow-md p-6 mb-4"
      >
        <div className="mb-4">
          <label
            htmlFor="fileInput"
            className="block mb-2 text-sm font-bold text-gray-700"
          >
            Upload CSV File
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Upload and Process
        </button>
      </form>

      {result.length > 0 && (
        <div className="results bg-white rounded shadow-md p-6">
          {result.map((item, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-bold mb-2">
                Case {index + 1}: A = {item.A}, B = {item.B}, C = {item.C}
              </h3>
              {typeof item.result === "string" ? (
                <p className="text-red-500">{item.result}</p>
              ) : (
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Step</th>
                      <th className="border px-4 py-2">Bag A</th>
                      <th className="border px-4 py-2">Bag B</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.result.map(([a, b], stepIndex) => (
                      <tr key={stepIndex}>
                        <td className="border px-4 py-2">{stepIndex + 1}</td>
                        <td className="border px-4 py-2">{a}</td>
                        <td className="border px-4 py-2">{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
