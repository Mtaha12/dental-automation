import axios from "axios";

const configuredBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function buildLocalCandidates() {
  const urls = [];

  try {
    const parsed = new URL(configuredBaseURL);
    const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);

    if (isLocalhost) {
      for (let port = 5000; port <= 5010; port += 1) {
        urls.push(`${parsed.protocol}//${parsed.hostname}:${port}/api`);
      }
      return urls;
    }
  } catch (_error) {
    // Fall through to a conservative localhost scan.
  }

  urls.push(configuredBaseURL);
  return urls;
}

const baseURLCandidates = buildLocalCandidates();
let resolvedBaseURL = baseURLCandidates[0];
let resolveBaseURLPromise = null;

async function probeBaseURL(candidate) {
  try {
    await axios.get(`${candidate.replace(/\/$/, "")}/health`, { timeout: 700 });
    return candidate;
  } catch (_error) {
    return null;
  }
}

async function resolveBaseURL() {
  if (resolveBaseURLPromise) {
    return resolveBaseURLPromise;
  }

  if (baseURLCandidates.length === 1) {
    resolvedBaseURL = baseURLCandidates[0];
    return resolvedBaseURL;
  }

  resolveBaseURLPromise = (async () => {
    for (const candidate of baseURLCandidates) {
      const workingBaseURL = await probeBaseURL(candidate);
      if (workingBaseURL) {
        resolvedBaseURL = workingBaseURL;
        return resolvedBaseURL;
      }
    }

    resolvedBaseURL = baseURLCandidates[0];
    return resolvedBaseURL;
  })();

  return resolveBaseURLPromise;
}

const api = axios.create({
  baseURL: resolvedBaseURL,
  timeout: 12000,
});

api.interceptors.request.use((config) => {
  return resolveBaseURL().then((baseURL) => {
    config.baseURL = baseURL;
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
});

export default api;
