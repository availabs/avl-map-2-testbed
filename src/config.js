let API_HOST = "https://graph.availabs.org";

if (process.env.NODE_ENV === "development") {
  API_HOST = "http://localhost:4444";
}

export { API_HOST };
