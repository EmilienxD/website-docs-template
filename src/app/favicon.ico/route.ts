// Some browsers request this conventional URL before reading the page icon metadata.
export function GET() {
  return new Response(null, {
    status: 308,
    headers: { Location: "/icon.svg" },
  });
}
