import * as z from "zod";
import sanitizeHtml from "sanitize-html";


const sanitizeObject = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => {
  return z.object(
    Object.fromEntries(
      Object.entries(schema.shape).map(([key, value]) => {
        if (value instanceof z.ZodString) {
          return [
            key,
            value.transform((val) =>
              sanitizeHtml(val, {
                allowedTags: [],
                parser: {
                  decodeEntities: true,
                },
              })
            ),
          ];
        }
        return [key, value];
      })
    ) as T
  );
};


export const signUpSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email:z.email()
})

export const changePasswordSchema= sanitizeObject(z.object({
    token:z.string(),
    newPassword: z.string()
}))


