import React, { useEffect, useState } from "react";
import { fetchInvestmentData } from "./api";

function InvestmentData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestmentData().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading investment data...</p>;
  if (!data) return <p>Failed to load investment data.</p>;

  return (
    <section>
      <h2>Your Investment Data</h2>
      {/* render your data here */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}
