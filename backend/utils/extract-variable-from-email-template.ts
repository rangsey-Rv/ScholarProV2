export function extractVariables(html: string): string[] {
  const regex = /{{\s*([\w]+)\s*}}/g;
  const variables = new Set<string>();
  let match;

  while ((match = regex.exec(html)) !== null) {
    variables.add(match[1]); 
  }

  return Array.from(variables);
}
