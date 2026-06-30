import listEmailTemplateNameService from "@services/email/list-email-template-name.service";

export async function isTemplateNameExist(templateName: string) {
  const result = await listEmailTemplateNameService();
  if (!result.success || !Array.isArray(result.data)) {
    return false;
  }
  return result.data.some(
    (item: { TemplateName?: string }) => item.TemplateName === templateName
  );
}
