export const findHtmlPart = (parts) => {
  for (const part of parts) {
    if (part.mimeType === "text/html" && part.body && part.body.data) {
      return atob(part.body.data.replace(/-/g, "+").replace(/_/g, "/"));
    }
    if (part.parts) {
      const htmlPart = findHtmlPart(part.parts);
      if (htmlPart) {
        return htmlPart;
      }
    }
  }
  return null;
};
