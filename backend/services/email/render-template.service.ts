import Handlebars from "handlebars";

export function renderTemplate(subject: string, bodyHtml: string , variables: Record<string, string>) {
    const compiledHtml = Handlebars.compile(bodyHtml);
    const compiledSubject = Handlebars.compile(subject);

    return {
        html: compiledHtml(variables),
        subject: compiledSubject(variables)
    };
}
