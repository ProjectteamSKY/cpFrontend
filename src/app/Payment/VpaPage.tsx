import React, { useState } from "react";
import axios from "axios";

const VpaPage: React.FC = () => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Your OAuth access token
  const ACCESS_TOKEN = "D3QzjDqWnaosZyfAQYv4eU3VQGFGGq6I";

  const handleCreateVpa = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Send access token as query parameter
      const res = await axios.post(
        `http://127.0.0.1:8000/api/bank/vpa/create?accesstoken=${ACCESS_TOKEN}`,
        {}, // empty body
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setResponse(res.data);
    } catch (err: any) {
      console.error(err);
      // FastAPI sends error in detail array
      setError(err?.response?.data?.detail?.[0]?.msg || "Failed to create VPA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Create VPA</h1>

      <button
        onClick={handleCreateVpa}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create VPA"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {response && (
        <div className="mt-4 p-2 border rounded bg-gray-50">
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default VpaPage;