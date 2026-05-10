import { useState } from "react";

const useFetch = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGoogle = async (response) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: response.credential }),
            });
            const data = await res.json();
            if (data?.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "/";
            } else {
                setError(data?.message || "Login failed. Please try again.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, handleGoogle };
};

export default useFetch;
