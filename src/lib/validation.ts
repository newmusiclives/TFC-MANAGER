// ---------------------------------------------------------------------------
// Input validation utilities (plain TypeScript — no external dependencies)
// ---------------------------------------------------------------------------

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isEmail(v: unknown): v is string {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isString(v: unknown, min = 0, max = Infinity): v is string {
  return typeof v === "string" && v.length >= min && v.length <= max;
}

function isOneOf<T extends string>(v: unknown, values: readonly T[]): v is T {
  return typeof v === "string" && (values as readonly string[]).includes(v);
}

function isUrl(v: unknown): v is string {
  if (typeof v !== "string") return false;
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

export function validateLogin(data: unknown): ValidationResult<{ email: string; password: string }> {
  if (!data || typeof data !== "object") return { success: false, error: "Invalid request body" };
  const d = data as Record<string, unknown>;
  const errors: string[] = [];

  if (!isEmail(d.email)) errors.push("Invalid email address");
  if (!isString(d.password, 6)) errors.push("Password must be at least 6 characters");

  if (errors.length) return { success: false, error: errors.join(", ") };
  return { success: true, data: { email: d.email as string, password: d.password as string } };
}

export function validateRegister(
  data: unknown
): ValidationResult<{ email: string; password: string; name: string; artistName?: string }> {
  if (!data || typeof data !== "object") return { success: false, error: "Invalid request body" };
  const d = data as Record<string, unknown>;
  const errors: string[] = [];

  if (!isEmail(d.email)) errors.push("Invalid email address");
  if (!isString(d.password, 8)) errors.push("Password must be at least 8 characters");
  if (!isString(d.name, 1, 100)) errors.push("Name is required (max 100 characters)");
  if (d.artistName !== undefined && !isString(d.artistName, 0, 100))
    errors.push("Artist name must be at most 100 characters");

  if (errors.length) return { success: false, error: errors.join(", ") };
  return {
    success: true,
    data: {
      email: d.email as string,
      password: d.password as string,
      name: d.name as string,
      ...(d.artistName ? { artistName: d.artistName as string } : {}),
    },
  };
}

export function validateRelease(
  data: unknown
): ValidationResult<{
  title: string;
  type: "SINGLE" | "EP" | "ALBUM";
  releaseDate?: string;
  genre?: string;
  description?: string;
}> {
  if (!data || typeof data !== "object") return { success: false, error: "Invalid request body" };
  const d = data as Record<string, unknown>;
  const errors: string[] = [];

  if (!isString(d.title, 1, 200)) errors.push("Title is required (max 200 characters)");
  const validTypes = ["SINGLE", "EP", "ALBUM"] as const;
  if (d.type !== undefined && !isOneOf(d.type, validTypes))
    errors.push(`Type must be one of: ${validTypes.join(", ")}`);
  if (d.releaseDate !== undefined && !isString(d.releaseDate))
    errors.push("Release date must be a string");
  if (d.genre !== undefined && !isString(d.genre, 0, 100))
    errors.push("Genre must be at most 100 characters");
  if (d.description !== undefined && !isString(d.description, 0, 2000))
    errors.push("Description must be at most 2000 characters");

  if (errors.length) return { success: false, error: errors.join(", ") };
  return {
    success: true,
    data: {
      title: d.title as string,
      type: (d.type as "SINGLE" | "EP" | "ALBUM") || "SINGLE",
      ...(d.releaseDate ? { releaseDate: d.releaseDate as string } : {}),
      ...(d.genre ? { genre: d.genre as string } : {}),
      ...(d.description ? { description: d.description as string } : {}),
    },
  };
}

export function validateSmartLink(
  data: unknown
): ValidationResult<{
  title: string;
  slug: string;
  platformLinks?: Record<string, string>;
}> {
  if (!data || typeof data !== "object") return { success: false, error: "Invalid request body" };
  const d = data as Record<string, unknown>;
  const errors: string[] = [];

  if (!isString(d.title, 1, 200)) errors.push("Title is required (max 200 characters)");
  if (!isString(d.slug, 1, 100) || !/^[a-z0-9-]+$/.test(d.slug as string))
    errors.push("Slug must be lowercase alphanumeric with hyphens (max 100 characters)");
  if (d.platformLinks !== undefined) {
    if (typeof d.platformLinks !== "object" || d.platformLinks === null || Array.isArray(d.platformLinks)) {
      errors.push("platformLinks must be an object mapping platform names to URLs");
    } else {
      for (const [key, val] of Object.entries(d.platformLinks as Record<string, unknown>)) {
        if (!isUrl(val)) errors.push(`Platform URL for "${key}" is not a valid URL`);
      }
    }
  }

  if (errors.length) return { success: false, error: errors.join(", ") };
  return {
    success: true,
    data: {
      title: d.title as string,
      slug: d.slug as string,
      ...(d.platformLinks ? { platformLinks: d.platformLinks as Record<string, string> } : {}),
    },
  };
}

export function validateSubscriber(
  data: unknown
): ValidationResult<{ email: string; name?: string; tags?: string[]; source?: string }> {
  if (!data || typeof data !== "object") return { success: false, error: "Invalid request body" };
  const d = data as Record<string, unknown>;
  const errors: string[] = [];

  if (!isEmail(d.email)) errors.push("Invalid email address");
  if (d.name !== undefined && !isString(d.name, 0, 200))
    errors.push("Name must be at most 200 characters");
  if (d.tags !== undefined && (!Array.isArray(d.tags) || !d.tags.every((t: unknown) => typeof t === "string")))
    errors.push("Tags must be an array of strings");
  if (d.source !== undefined && typeof d.source !== "string")
    errors.push("Source must be a string");

  if (errors.length) return { success: false, error: errors.join(", ") };
  return {
    success: true,
    data: {
      email: d.email as string,
      ...(d.name ? { name: d.name as string } : {}),
      ...(d.tags ? { tags: d.tags as string[] } : {}),
      ...(d.source ? { source: d.source as string } : {}),
    },
  };
}

export function validateContentGenerate(
  data: unknown
): ValidationResult<{ type: string; context: string }> {
  if (!data || typeof data !== "object") return { success: false, error: "Invalid request body" };
  const d = data as Record<string, unknown>;
  const errors: string[] = [];

  const validTypes = ["social_post", "caption", "hashtags", "email", "press_release", "story_ideas", "bio"];
  if (!isOneOf(d.type, validTypes))
    errors.push(`Type must be one of: ${validTypes.join(", ")}`);
  if (!isString(d.context, 1, 5000))
    errors.push("Context is required (max 5000 characters)");

  if (errors.length) return { success: false, error: errors.join(", ") };
  return { success: true, data: { type: d.type as string, context: d.context as string } };
}
