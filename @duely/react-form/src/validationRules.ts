function formatFileSize(size: number) {
  if (size < 1000) return `${size.toFixed(0)}B`;

  size /= 1000;
  if (size < 1000) return `${size.toPrecision(3)}KB`;

  size /= 1000;
  if (size < 1000) return `${size.toPrecision(3)}MB`;

  size /= 1000;
  if (size < 1000) return `${size.toPrecision(3)}GB`;
}

export namespace ValidationRules {
  export function maxFileSize(bytes: number) {
    return (fileList: FileList) =>
      fileList?.[0]?.size > bytes ? `Maximum image size is ${formatFileSize(bytes)}.` : undefined;
  }
}
