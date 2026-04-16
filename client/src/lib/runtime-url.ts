export function getCurrentOrigin() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
}

export function getSameOriginUrl(path: string) {
  if (!path.startsWith("/")) {
    throw new Error("Path must start with '/'.");
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }

  return path;
}
