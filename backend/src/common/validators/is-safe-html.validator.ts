import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsSafeHtml(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSafeHtml',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          
          // Pattern checking for common XSS vectors
          const xssPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // script tags
            /src\s*=\s*['"]\s*javascript:[^'"]*['"]/gi,            // JS URIs in src
            /href\s*=\s*['"]\s*javascript:[^'"]*['"]/gi,           // JS URIs in href
            /on\w+\s*=\s*['"][^'"]*['"]/gi,                        // Inline event handlers
            /<iframe\b/gi,                                         // iframe tags
            /<object\b/gi,                                         // object tags
            /<embed\b/gi,                                          // embed tags
          ];

          return !xssPatterns.some((pattern) => pattern.test(value));
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} contains unsafe HTML markup or scripts.`;
        },
      },
    });
  };
}
