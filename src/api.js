const API_URL = process.env.REACT_APP_API_URL;

export async function fetchInvestmentData() {
  try {
    const response = await fetch(`${API_URL}/investments`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch investment data failed:", error);
    return null;
  }
}
