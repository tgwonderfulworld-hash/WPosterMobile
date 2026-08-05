/**
 * Message nesting — a byte-for-byte port of WPoster Web's `nestMessages`
 * (src/i18n/request.ts). The shared message files store some keys in dotted-flat
 * form ("nav.features") and some as nested objects; Web nests them before handing
 * them to next-intl. We apply the identical transform so `use-intl` resolves the
 * exact same paths as the web app. Do not diverge from Web's implementation.
 */
type Dict = Record<string, unknown>;

function deepMerge(target: Dict, source: Dict): void {
  for (const key of Object.keys(source)) {
    const value = source[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      target[key] = (target[key] as Dict) || {};
      deepMerge(target[key] as Dict, value as Dict);
    } else {
      target[key] = value;
    }
  }
}

export function nestMessages(messages: Dict): Dict {
  const nested: Dict = {};

  function setPath(obj: Dict, pathParts: string[], value: unknown): void {
    let current = obj;
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      if (i === pathParts.length - 1) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          current[part] = current[part] || {};
          Object.assign(current[part] as Dict, value);
        } else {
          current[part] = value;
        }
      } else {
        if (!current[part] || typeof current[part] !== 'object' || Array.isArray(current[part])) {
          current[part] = {};
        }
        current = current[part] as Dict;
      }
    }
  }

  for (const [key, value] of Object.entries(messages)) {
    if (key.includes('.')) {
      setPath(nested, key.split('.'), value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      nested[key] = nested[key] || {};
      deepMerge(nested[key] as Dict, nestMessages(value as Dict));
    } else {
      nested[key] = value;
    }
  }

  return nested;
}
