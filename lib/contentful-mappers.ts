import type { ILandingPage } from "@/features/contentful/type";

/**
 * Deep clones an object while handling circular references.
 * Uses a stack-based approach to detect true circular references (object in its own ancestry).
 */
function deepCloneWithCircularHandling(obj: unknown): unknown {
  // Track objects in the current path (ancestry) to detect true circular refs
  const ancestors = new WeakMap<object, boolean>();
  
  function clone(value: unknown, depth: number = 0): unknown {
    // Prevent infinite recursion with a reasonable depth limit
    if (depth > 50) {
      return null;
    }
    
    // Handle primitives and null
    if (value === null || typeof value !== "object") {
      return value;
    }
    
    const obj = value as object;
    
    // Check for true circular reference (object is in its own ancestry)
    if (ancestors.has(obj)) {
      // Return a minimal placeholder for truly circular refs
      if ("sys" in obj) {
        const sys = (obj as { sys?: { id?: string; type?: string } }).sys;
        return { _circular: true, sys: { id: sys?.id, type: sys?.type } };
      }
      return { _circular: true };
    }
    
    // Handle arrays
    if (Array.isArray(obj)) {
      ancestors.set(obj, true);
      const result = obj.map((item) => clone(item, depth + 1));
      ancestors.delete(obj);
      return result;
    }
    
    // Handle Date objects
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    
    // Handle plain objects
    ancestors.set(obj, true);
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
      result[key] = clone((obj as Record<string, unknown>)[key], depth + 1);
    }
    ancestors.delete(obj);
    return result;
  }
  
  return clone(obj);
}

/**
 * Normalizes a Contentful entry to ensure it's serializable and safe for client components.
 * This avoids passing Contentful SDK objects directly across the server-client boundary.
 * Handles circular references that can occur in deeply nested Contentful entries.
 */
export function mapLandingPageToProps(entry: ILandingPage): ILandingPage {
  // Deep clone with circular reference handling
  return deepCloneWithCircularHandling(entry) as ILandingPage;
}
