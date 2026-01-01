import React from "react";

export default function ProtectedPage() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Protected Page</h2>
      <p>This page is protected and requires an authenticated user.</p>
    </div>
  );
}
