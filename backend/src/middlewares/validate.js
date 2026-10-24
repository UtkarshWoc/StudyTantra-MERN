import { badRequest } from '../utils/httpError.js';

// Validate req.body / req.params against zod schemas. Parsed (trimmed, coerced)
// values replace the originals. Express 5's req.query is read-only, so a parsed
// query is exposed as req.validatedQuery.
export const validate = (schemas) => (req, res, next) => {
  for (const part of ['body', 'params', 'query']) {
    if (!schemas[part]) continue;
    const result = schemas[part].safeParse(req[part] ?? {});
    if (!result.success) {
      const details = result.error.issues.map((i) => `${i.path.join('.') || part}: ${i.message}`);
      return next(badRequest(result.error.issues[0]?.message || 'Invalid request', details));
    }
    if (part === 'query') req.validatedQuery = result.data;
    else req[part] = result.data;
  }
  next();
};
